
import React from "react";

import Profile from "~/components/Profile";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Entry } from "~/interface";
import Footer from "~/components/Footer";

interface AppProps {
  entry: Entry;
}

export async function loader({ }: LoaderFunctionArgs) {
  return json({ 
    entry: {
      name: 'Naeem Shaikh',
      designation: 'Software Engineer @ Contentstack',
      description: 'I am a software engineer with a passion & experience in building scalable and reliable software systems.',
      linkedin: 'https://www.linkedin.com/in/naeem-shaikh',
      github:'https://github.com/naeemshaikh27',
      x:'',
      dp:  '/cs_logo.png'
    } 
  });
}

export default function Index() {
  const { entry } = useLoaderData() as AppProps;
  return (
    <div>
      <Profile
        dp={entry.dp}
        name={entry.name}
        designation={entry.designation}
        description={entry.description}
        width={200}
        height={200}
        linkedinUrl={entry.linkedin}
        githubUrl={entry.github}
        xUrl={entry.x}
      />

      <Footer/>
    </div>
  );
}
