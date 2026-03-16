import { useState } from "react"
import axios from "axios"
import LoadingSpinner from "./LoadingSpinner"

export default function UrlInput({setResults}){

  const [url,setUrl] = useState("")
  const [loading,setLoading] = useState(false)

  const analyze = async () => {

    setLoading(true)

    try{

      const res = await axios.post(
        "http://localhost:8000/analyze",
        {url}
      )

      setResults(res.data)

    }catch{

      alert("Error analyzing site")

    }

    setLoading(false)

  }

  return(

    <div className="bg-white shadow p-6 rounded-lg">

      <h2 className="text-lg font-semibold mb-4">
        Analyze Website
      </h2>

      <div className="flex gap-3">

        <input
          type="text"
          placeholder="Enter website URL"
          value={url}
          onChange={(e)=>setUrl(e.target.value)}
          className="border px-3 py-2 flex-1 rounded"
        />

        <button
          onClick={analyze}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Analyze
        </button>

      </div>

      {loading && <LoadingSpinner />}

    </div>

  )

}