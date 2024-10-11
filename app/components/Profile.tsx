import Contacts from "./Contacts";

interface ProfileProps {
  imageSrc: string;
  name: string;
  title: string;
  description: string;
  width: number;
  height: number;
  linkedinUrl: string;
  githubUrl: string;
}

export default function Profile({ imageSrc, name, title, description, linkedinUrl, githubUrl, width, height }: ProfileProps) {
  return (
    <div className="grid max-w-lg grid-cols-1 justify-items-center gap-4 mb-4 mx-auto">
      <img
        src={imageSrc}
        alt={name}
        className="h-auto max-w-32 rounded-full overflow-hidden" // Adjust max-w-xs to suit your design
        width={width}
        height={height}
        
      />
      <div className="grid grid-cols-1 gap-2 text-center">
        <h1 className="font-sans font-semibold tracking-tighter dark:text-white text-slate-800 text-3xl md:text-4xl">
          {name}
        </h1>
        <p className="font-sans font-semibold text-xl italic font-se eading-normal tracking-tight dark:text-slate-400 text-slate-700">
          {title}
        </p>
        <p className="font-serif text-md italic font-se eading-normal tracking-tight dark:text-slate-400 text-slate-700 pt-8">
          {description}
        </p>
      </div>
      <Contacts linkedinUrl={linkedinUrl} githubUrl={githubUrl}/>
    </div>
  );
}
