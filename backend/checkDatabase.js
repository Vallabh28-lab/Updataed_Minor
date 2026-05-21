const mongoose = require("mongoose");
require("dotenv").config();

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ Connected to MongoDB");
    
    // Get database instance
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log("\n📋 Collections in database:");
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Check for criminal dataset specifically
    const criminalCollection = collections.find(col => 
      col.name.toLowerCase().includes('crime') || 
      col.name.toLowerCase().includes('criminal')
    );
    
    if (criminalCollection) {
      console.log(`\n🔍 Found criminal dataset: ${criminalCollection.name}`);
      
      // Get sample documents
      const collection = db.collection(criminalCollection.name);
      const count = await collection.countDocuments();
      console.log(`📊 Total documents: ${count}`);
      
      if (count > 0) {
        const sample = await collection.findOne();
        console.log("\n📄 Sample document:");
        console.log(JSON.stringify(sample, null, 2));
      }
    } else {
      console.log("\n❌ No criminal dataset found");
    }
    
  } catch (error) {
    console.error("❌ Database Error:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
}

checkDatabase();