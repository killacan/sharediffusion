

export default function PrivacyPolicy() {

    let subheading = "text-2xl"

    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <div className="animate-in flex-1 flex flex-col gap-3 opacity-0 max-w-4xl px-3">
                <h1 className="text-3xl">Privacy Policy for share diffusion</h1>

                <p>At share diffusion, accessible from sharediffusion.org, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by share diffusion and how we use it.</p>
                
                <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at sharediffusion@gmail.com.</p>
                
                <h2 className={subheading}>Log Files</h2>
                
                <p>share diffusion follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information. Our Privacy Policy was created with the help of the <a href="https://www.privacypolicygenerator.org">Privacy Policy Generator</a>.</p>
                
                <h2 className={subheading}>Cookies and Web Beacons</h2>
                
                <p>Like any other website, share diffusion uses "cookies". The cookies used by Share Diffusion are only for the purposes of authentication. </p>
                
                <h2 className={subheading}>Third Party Privacy Policies</h2>
                
                <p>share diffusion's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options. </p>
                
                <p>You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.</p>
                
                <h2 className={subheading}>Children's Information</h2>
                
                <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>
                
                <p>share diffusion does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>
                
                <h2 className={subheading}>Online Privacy Policy Only</h2>
                
                <p>This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in share diffusion. This policy is not applicable to any information collected offline or via channels other than this website.</p>
                
                <h2 className={subheading}>Consent</h2>
                
                <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>

                <p>Note: Privacy Policy will be updated in the future, website is in pre-alpha stage.</p>		
            </div>
        </div>							
    )
}