import SocialCard from "~/components/SocialCard";
import type { ReactElement } from 'react';

interface ContactsProps {
    linkedinUrl: string;
    githubUrl: string;
  }
const Contacts= ({linkedinUrl, githubUrl}:ContactsProps) => {
    const LinekdinIcon: ReactElement = (
      <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" fill="#fff">
      <path d="M4.98 3.5C4.98 4.88 3.84 6 2.5 6S0 4.88 0 3.5 1.14 1 2.5 1 4.98 2.12 4.98 3.5zM0 9h5v15H0V9zm15.12 0c-1.74 0-2.73.95-3.2 1.84V9h-5v15h5v-7.5c0-1.84 1.1-2.84 2.9-2.84 1.73 0 2.8 1.2 2.8 2.94V24h5v-10.5c0-4.14-2.24-6.6-5.88-6.6z"/>
  </svg></span>
    );
  
    const GithubIcon: ReactElement = (
      <span><svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="20"
      width="20"
    >
      <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
    </svg></span>
    );
  
    return (
        
       <div className="flex flex-col items-center p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
        
            <SocialCard
            service="Linkedin"
            href={linkedinUrl}
            icon={LinekdinIcon}
            />
            <SocialCard
            service="GitHub"
            href={githubUrl}
            icon={GithubIcon}
            />
        </div>
      </div>
    );
  };
  
  export default Contacts;