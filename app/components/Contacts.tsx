import SocialCard from "~/components/SocialCard";
import type { ReactElement } from 'react';

interface ContactsProps {
    linkedinUrl: string;
    githubUrl: string;
  }
const Contacts= ({linkedinUrl, githubUrl}:ContactsProps) => {
  const LinekdinIcon: ReactElement = (
    <span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
            <path d="M22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.21 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.58c-1.14 0-2.06-.92-2.06-2.06s.92-2.06 2.06-2.06 2.06.92 2.06 2.06-.92 2.06-2.06 2.06zM20.45 20.45h-3.56v-5.61c0-1.34-.03-3.06-1.86-3.06-1.86 0-2.14 1.45-2.14 2.95v5.72h-3.56V9h3.42v1.56h.05c.48-.91 1.65-1.86 3.4-1.86 3.63 0 4.3 2.39 4.3 5.5v6.25z"/>
        </svg>
    </span>
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