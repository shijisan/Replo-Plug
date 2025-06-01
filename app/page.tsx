import SearchBar from "@/components/SearchBar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main>
        <header className="pt-[18vh] flex items-center flex-col w-full min-h-screen text-center space-y-8">
          <h1 className="text-5xl font-medium">Replo Plug</h1>
          <p className="max-w-[49rem]">Replo sucks at documentation so I made one - for the people by a people?
            Anyways use the search bar to find a keyword or title that corresponds to a hand-typed documentation from your boy.
            If there is a missing feature please send an email via the <Link className="text-blue-500 underline" href="/contact">Contact Page</Link> and hope I'd see
            the email and write about it.
          </p>

          <p>Please check out my <Link className="text-blue-500 underline" href="https://github.com/shijisan">GitHub</Link> as I build more cool stuff there!</p>

          <div className="max-w-3xl w-full">
            <SearchBar />
          </div>
        </header>
      </main>
    </>
  )
}