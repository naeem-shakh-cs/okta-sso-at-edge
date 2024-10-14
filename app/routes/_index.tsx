
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
