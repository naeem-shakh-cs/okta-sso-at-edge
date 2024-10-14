
import React from "react";

import Profile from "~/components/Profile";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Entry } from "~/interface";
import Footer from "~/components/Footer";
import { fetchEntries } from "~/contentstack";

interface AppProps {
  entry: Entry;
}

export async function loader({ }: LoaderFunctionArgs) {
  const entry = await fetchEntries();
  // const entry: Entry = {
  //   name: "Chhavi Mandowara",
  //   title: "Software Engineer @ Contentstack",
  //   short_bio: "Creative software engineer skilled in full-stack development, specializing in building scalable applications. Enthusiastic about leveraging cutting-edge technologies and collaborating in agile teams to deliver impactful solutions.",
  //   linkedin: "https://www.linkedin.com/in/chhavi-mandowara-497a27262/",
  //   github: "https://github.com/chhavi-mandowara",
  //   image: 'https://media.licdn.com/dms/image/v2/D4E03AQEZ3kGiHE8vNA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1685809844546?e=1733961600&v=beta&t=CkgG3LZEmkhiLS90gv9kml1ZCqnc7iMcAo6uXwqRBjc',
  //   tags: [],
  // };
  console.log(entry);
  return json({ entry });
}

export default function Index() {
  const { entry } = useLoaderData() as AppProps;
  return (
    <div>
      <Profile
        imageSrc={entry.image}
        name={entry.name}
        title={entry.title}
        description={entry.short_bio}
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
