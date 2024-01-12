
export default async function Index() {


  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <h1 className="text-6xl text-center pt-6">Share Diffusion</h1>
          {/* <div className="">
            <h2 className="text-3xl text-center">Top Models</h2>
          </div>

          <div className="">
            <h2 className="text-3xl text-center">Top Photos</h2>
          </div> */}
          
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl text-center">About</h2>

            <p>
              Share Diffusion is a platform for sharing stable diffusion models. Since stable diffusion models
              are often large, and servers for hosting them are expensive, Share Diffusion allows users to share their
              models using magnet links. 
            </p>

            <p>
              My goal with this project is to be a community driven platform, with a focus on maintaining 
              independence from any company or organization. My goal is to never have to run ads, sell user 
              data, or otherwise compromise the integrity of the platform. 
            </p>

            <p>Share Diffusion is currently in alpha. If you have any questions or feedback, please join the 
              <a className="text-blue-700" href="https://discord.gg/y7aMda893Y" target="_blank" rel="noopener noreferrer"> Discord server</a>.
            </p>

            <p>Share diffusion is open source, with the source code located on Github. If you are a developer and want
              to help improve the project, please feel free to use
              <a className="text-blue-700" href="https://github.com/killacan/sharediffusion" target="_blank" rel="noopener noreferrer"> this link </a> 
              to access the repository.

            </p>
          </div>
        </main>
      </div>

    </div>
  )
}
