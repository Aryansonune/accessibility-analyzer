import IssueCard from "./IssueCard"

export default function ResultsPanel({results}){

  if(!results) return null

  return(

    <div className="mt-6 grid md:grid-cols-3 gap-4">

      <IssueCard
        title="Errors"
        items={results.errors}
        color="red"
      />

      <IssueCard
        title="Warnings"
        items={results.warnings}
        color="yellow"
      />

      <IssueCard
        title="Suggestions"
        items={results.suggestions}
        color="green"
      />

    </div>

  )

}