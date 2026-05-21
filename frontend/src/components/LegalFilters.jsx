import React from "react"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CaseCard } from "@/components/CaseCard"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const FilterSection = ({ title, items, selectedValue, onSelect, filterKey }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full space-y-2 border rounded-lg p-2 bg-white">
      <div className="flex items-center justify-between px-2">
        <h4 className="text-sm font-semibold">{title}</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2 px-2 pb-2">
        {items.map((item) => (
          <div
            key={item}
            onClick={() => onSelect(filterKey, item)}
            className={`rounded-md border px-4 py-2 text-sm cursor-pointer transition-colors ${selectedValue === item
                ? 'bg-blue-100 border-blue-300 text-blue-800'
                : 'hover:bg-slate-50'
              }`}
          >
            {item}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

export default function LegalFilters() {
  const [selectedFilters, setSelectedFilters] = React.useState({
    court: null,
    year: null,
    type: null,
    outcome: null
  })
  const [searchResults, setSearchResults] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedCase, setSelectedCase] = React.useState(null)

  const handleFilterSelect = (filterKey, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: prev[filterKey] === value ? null : value
    }))
  }

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      // Filter out null values and prepare search payload
      const searchPayload = Object.fromEntries(
        Object.entries(selectedFilters).filter(([_, value]) => value !== null)
      )

      console.log('Searching with filters:', searchPayload)

      const response = await fetch("http://127.0.0.1:5001/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchPayload),
      })

      const data = await response.json()
      setSearchResults(data)
      console.log("Data received from MongoDB:", data)
    } catch (error) {
      console.error('Connection failed:', error)
      // Fallback to mock data if API fails
      const mockResults = [
        { id: 'C001', year: '2023', court: 'High Court', type: 'Criminal', outcome: 'Convicted', title: 'State vs. John Doe' },
        { id: 'C002', year: '2022', court: 'Supreme Court', type: 'Civil', outcome: 'Plaintiff Won', title: 'Smith vs. Corporation Ltd' },
        { id: 'C003', year: '2023', court: 'District Court', type: 'Banking', outcome: 'Settled', title: 'Bank vs. Borrower' }
      ]
      setSearchResults(mockResults)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Search & Filter Section */}
      <section className="mb-10">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">Legal Research Platform</h1>
          <p className="text-lg text-muted-foreground font-light">Comprehensive case law database and legal precedent search</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <FilterSection
            title="Court Level"
            items={["Supreme Court", "High Court", "District Court"]}
            selectedValue={selectedFilters.court}
            onSelect={handleFilterSelect}
            filterKey="court"
          />
          <FilterSection
            title="Year"
            items={["2023", "2022", "2021", "2020"]}
            selectedValue={selectedFilters.year}
            onSelect={handleFilterSelect}
            filterKey="year"
          />
          <FilterSection
            title="Case Type"
            items={["Criminal", "Civil", "Banking", "Consumer"]}
            selectedValue={selectedFilters.type}
            onSelect={handleFilterSelect}
            filterKey="type"
          />
          <FilterSection
            title="Outcome"
            items={["Convicted", "Acquitted", "Plaintiff Won", "Settled"]}
            selectedValue={selectedFilters.outcome}
            onSelect={handleFilterSelect}
            filterKey="outcome"
          />
        </div>

        {/* Search Button */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-8 py-2"
          >
            {isLoading ? 'Searching...' : 'Search Cases'}
          </Button>
        </div>

        {/* Results Header */}
        <div className="mt-10 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Case Precedents</h2>
            <p className="text-sm text-muted-foreground">Relevant legal decisions and judgments</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-muted-foreground">
              {searchResults.length} {searchResults.length === 1 ? 'case' : 'cases'} found
            </span>
          </div>
        </div>
        <Separator className="mb-8" />
      </section>

      {/* Results Grid */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col space-y-3 border p-4 rounded-xl">
                <Skeleton className="h-[20px] w-[250px]" />
                <Skeleton className="h-[15px] w-[400px]" />
                <div className="flex gap-2">
                  <Skeleton className="h-[12px] w-[60px]" />
                  <Skeleton className="h-[12px] w-[60px]" />
                  <Skeleton className="h-[12px] w-[80px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          searchResults.map((legalCase, index) => (
            <div key={legalCase._id || legalCase.id || index} onClick={() => setSelectedCase(legalCase)}>
              <CaseCard legalCase={legalCase} />
            </div>
          ))
        )}
      </div>

      {/* Quick-View Sheet */}
      <Sheet open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl">
              {selectedCase?.case_title || selectedCase?.title}
            </SheetTitle>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs">
                {selectedCase?.court_level || selectedCase?.court}
              </span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                {selectedCase?.year}
              </span>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  )
}