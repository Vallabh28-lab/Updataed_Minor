import logging
from typing import List, Dict, Optional
from datetime import datetime, date, time
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

logger = logging.getLogger(__name__)

# Database connection
DATABASE_URL = "postgresql://postgres:vallabh@localhost:5432/lawyerdb"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)


class AppointmentService:
    """Production-grade appointment booking and management service"""
    
    @staticmethod
    def book_appointment(
        user_id: Optional[int],
        user_name: str,
        user_email: str,
        user_phone: str,
        lawyer_id: int,
        appointment_date: date,
        appointment_time: time,
        issue_summary: str
    ) -> Dict:
        """Book a new appointment with a lawyer"""
        session = SessionLocal()
        
        try:
            logger.info(
                f"Booking appointment: user={user_email}, "
                f"lawyer_id={lawyer_id}, date={appointment_date}"
            )
            
            # Check if lawyer exists and is active
            lawyer_check = session.execute(
                text("SELECT name, is_active FROM lawyers WHERE id = :lawyer_id"),
                {"lawyer_id": lawyer_id}
            )
            lawyer = lawyer_check.fetchone()
            
            if not lawyer:
                return {"success": False, "error": "Lawyer not found"}
            
            if not lawyer[1]:
                return {"success": False, "error": "Lawyer is not accepting appointments"}
            
            # Insert appointment
            result = session.execute(
                text("""
                    INSERT INTO appointments (
                        user_id, user_name, user_email, user_phone,
                        lawyer_id, appointment_date, appointment_time,
                        issue_summary, status
                    ) VALUES (
                        :user_id, :user_name, :user_email, :user_phone,
                        :lawyer_id, :appointment_date, :appointment_time,
                        :issue_summary, 'Pending'
                    )
                    RETURNING id, status, created_at
                """),
                {
                    "user_id": user_id,
                    "user_name": user_name,
                    "user_email": user_email,
                    "user_phone": user_phone,
                    "lawyer_id": lawyer_id,
                    "appointment_date": appointment_date,
                    "appointment_time": appointment_time,
                    "issue_summary": issue_summary
                }
            )
            
            session.commit()
            appointment = result.fetchone()
            
            logger.info(f"Appointment booked successfully: ID={appointment[0]}")
            
            return {
                "success": True,
                "appointment": {
                    "id": appointment[0],
                    "status": appointment[1],
                    "lawyer_name": lawyer[0],
                    "created_at": appointment[2].isoformat()
                }
            }
            
        except Exception as e:
            session.rollback()
            logger.error(f"Appointment booking error: {str(e)}", exc_info=True)
            return {"success": False, "error": str(e)}
        finally:
            session.close()
    
    @staticmethod
    def get_appointment(appointment_id: int) -> Optional[Dict]:
        """Get appointment details"""
        session = SessionLocal()
        
        try:
            result = session.execute(
                text("""
                    SELECT 
                        a.id, a.user_name, a.user_email, a.user_phone,
                        a.appointment_date, a.appointment_time,
                        a.issue_summary, a.status, a.notes,
                        l.name, l.specialization, l.phone, l.email,
                        l.office_address, l.consultation_fee
                    FROM appointments a
                    JOIN lawyers l ON a.lawyer_id = l.id
                    WHERE a.id = :appointment_id
                """),
                {"appointment_id": appointment_id}
            )
            
            row = result.fetchone()
            
            if not row:
                return None
            
            return {
                "id": row[0],
                "user_name": row[1],
                "user_email": row[2],
                "user_phone": row[3],
                "appointment_date": row[4].isoformat(),
                "appointment_time": row[5].isoformat(),
                "issue_summary": row[6],
                "status": row[7],
                "notes": row[8],
                "lawyer": {
                    "name": row[9],
                    "specialization": row[10],
                    "phone": row[11],
                    "email": row[12],
                    "office_address": row[13],
                    "consultation_fee": float(row[14]) if row[14] else None
                }
            }
            
        except Exception as e:
            logger.error(f"Get appointment error: {str(e)}", exc_info=True)
            return None
        finally:
            session.close()
    
    @staticmethod
    def get_user_appointments(user_id: int) -> List[Dict]:
        """Get all appointments for a user"""
        session = SessionLocal()
        
        try:
            result = session.execute(
                text("""
                    SELECT 
                        a.id, a.appointment_date, a.appointment_time,
                        a.status, a.issue_summary,
                        l.name, l.specialization, l.phone
                    FROM appointments a
                    JOIN lawyers l ON a.lawyer_id = l.id
                    WHERE a.user_id = :user_id
                    ORDER BY a.appointment_date DESC, a.appointment_time DESC
                """),
                {"user_id": user_id}
            )
            
            appointments = []
            for row in result:
                appointments.append({
                    "id": row[0],
                    "appointment_date": row[1].isoformat(),
                    "appointment_time": row[2].isoformat(),
                    "status": row[3],
                    "issue_summary": row[4],
                    "lawyer_name": row[5],
                    "lawyer_specialization": row[6],
                    "lawyer_phone": row[7]
                })
            
            return appointments
            
        except Exception as e:
            logger.error(f"Get user appointments error: {str(e)}", exc_info=True)
            return []
        finally:
            session.close()
    
    @staticmethod
    def update_appointment_status(
        appointment_id: int,
        status: str,
        notes: Optional[str] = None
    ) -> Dict:
        """Update appointment status"""
        session = SessionLocal()
        
        valid_statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled']
        
        if status not in valid_statuses:
            return {"success": False, "error": f"Invalid status. Must be one of: {valid_statuses}"}
        
        try:
            result = session.execute(
                text("""
                    UPDATE appointments
                    SET status = :status, notes = :notes, updated_at = CURRENT_TIMESTAMP
                    WHERE id = :appointment_id
                    RETURNING id, status
                """),
                {
                    "appointment_id": appointment_id,
                    "status": status,
                    "notes": notes
                }
            )
            
            session.commit()
            updated = result.fetchone()
            
            if not updated:
                return {"success": False, "error": "Appointment not found"}
            
            logger.info(f"Appointment {appointment_id} status updated to {status}")
            
            return {
                "success": True,
                "appointment_id": updated[0],
                "status": updated[1]
            }
            
        except Exception as e:
            session.rollback()
            logger.error(f"Update appointment error: {str(e)}", exc_info=True)
            return {"success": False, "error": str(e)}
        finally:
            session.close()
    
    @staticmethod
    def get_lawyer_appointments(lawyer_id: int, status: Optional[str] = None) -> List[Dict]:
        """Get all appointments for a lawyer"""
        session = SessionLocal()
        
        try:
            query = """
                SELECT 
                    id, user_name, user_email, user_phone,
                    appointment_date, appointment_time,
                    issue_summary, status, created_at
                FROM appointments
                WHERE lawyer_id = :lawyer_id
            """
            
            params = {"lawyer_id": lawyer_id}
            
            if status:
                query += " AND status = :status"
                params["status"] = status
            
            query += " ORDER BY appointment_date DESC, appointment_time DESC"
            
            result = session.execute(text(query), params)
            
            appointments = []
            for row in result:
                appointments.append({
                    "id": row[0],
                    "user_name": row[1],
                    "user_email": row[2],
                    "user_phone": row[3],
                    "appointment_date": row[4].isoformat(),
                    "appointment_time": row[5].isoformat(),
                    "issue_summary": row[6],
                    "status": row[7],
                    "created_at": row[8].isoformat()
                })
            
            return appointments
            
        except Exception as e:
            logger.error(f"Get lawyer appointments error: {str(e)}", exc_info=True)
            return []
        finally:
            session.close()


# Convenience functions
def book(user_id, user_name, user_email, user_phone, lawyer_id, date, time, issue):
    return AppointmentService.book_appointment(
        user_id, user_name, user_email, user_phone, lawyer_id, date, time, issue
    )


def get_appointment(appointment_id):
    return AppointmentService.get_appointment(appointment_id)


def update_status(appointment_id, status, notes=None):
    return AppointmentService.update_appointment_status(appointment_id, status, notes)


# Testing
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    from datetime import date, time
    
    print("Testing Appointment Service")
    print("=" * 60)
    
    # Test booking
    print("\n1. Testing Appointment Booking:")
    result = book(
        user_id=1,
        user_name="John Doe",
        user_email="john@example.com",
        user_phone="9876543210",
        lawyer_id=1,
        date=date(2024, 12, 15),
        time=time(10, 0),
        issue="Need consultation for corporate merger"
    )
    print(f"Success: {result.get('success')}")
    if result.get('success'):
        print(f"Appointment: {result['appointment']}")
        
        # Test get appointment
        print("\n2. Testing Get Appointment:")
        appointment = get_appointment(result['appointment']['id'])
        print(f"Appointment Details: {appointment}")
