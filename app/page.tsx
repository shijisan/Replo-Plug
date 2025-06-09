"use client"
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import MostViewed from "@/components/MostViewed";
import Image from "next/image";

export default function Home() {
	return (
		<>
			<main className="flex min-h-screen">
				{/* Main Content */}
				{/* Sidebar */}
				<MostViewed />
				<div>
					<header className="flex-1 pt-[13vh] pb-[5vh] px-[5vw]">
						<div className="max-w-4xl">
							<div className="space-y-8">
								<div>
									<h1 className="text-5xl font-medium">Replo Plug</h1>
									<p className="max-w-4xl mt-4">
										Replo sucks at documentation so I made one - for the people by a people?
										Anyways use the search bar to find a keyword or title that corresponds to a hand-typed documentation from your boy.
										If there is a missing feature please send an email via the <Link className="text-blue-500 underline" href="/contact">Contact Page</Link> and hope I&apos;d see
										the email and write about it.
									</p>

									<p className="mt-4">Please check out my <Link className="text-blue-500 underline" href="https://github.com/shijisan">GitHub</Link> as I build more cool stuff there!</p>

									<div className="max-w-3xl w-full mt-8">
										<SearchBar />
									</div>
								</div>
							</div>
						</div>
					</header>
					<section className="flex flex-col px-[5vw] space-y-4 mb-[5vh]">
						<h1 className="text-3xl font-medium">What is Replo?</h1>
						<div className="flex gap-8">
							<Image className="rounded-lg" src="/hero-img-1.png" alt="" height={150} width={375}></Image>
							<Image className="rounded-lg" src="/hero-img-2.png" alt="" height={150} width={375}></Image>
						</div>
						<p className="max-w-4xl">
							Replo is a visual web development platform that allows teams to build high-performance marketing pages inside Shopify without writing code. It provides a drag-and-drop interface, custom components, and seamless Shopify integration, making it easy for marketers and designers to create pixel-perfect landing pages that convert.
						</p>

					</section>
					<section className="px-[5vw] flex flex-col space-y-4">
						<h1 className="text-3xl font-medium">Why make a third-party documentation site?</h1>
						<p className="max-w-4xl">
							Replo doesn&apos;t cover every edge case or dev-related issue in their official docs, but as a developer using it in real-world projects, I do. That&apos;s why I made this — to help others in the Replo community with the stuff that isn&apos;t fully documented yet.
						</p>
					</section>

				</div>


			</main>
		</>
	)
}