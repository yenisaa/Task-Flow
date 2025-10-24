import Link from "next/link";
import { Feature, data } from "./data/data";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-linear-to-br from-primary/10 via-background to-secondary/10">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-linear-to-br from-indigo-600/80 to-indigo-800 text-indigo-600 px-6 py-3 rounded-lg transition-colors">Task Flow</h1>
        <p className="text-xl text-gray-500">
          The beautiful way to manage your daily tasks
        </p>

        <Link
          href="/auth"
          className="inline-block mt-8 bg-linear-to-br from-indigo-600/80 to-indigo-900 hover:bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
        >
          Get Started
        </Link>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.map((feature: Feature) => (
            <div
              key={feature.id}
              className=" flex flex-col items-center justify-center text-center p-6 rounded-lg bg-card shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-12 h-12 mb-4  " 
                
              />
              <h3 className="text-xl font-bold mb-2 text-indigo-600">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
