import { ActionPanel, Detail, List, Action } from "@raycast/api";
import React from "react";
import { getCacheManager } from "./cache-manager";

export default function Command() {
  console.log("initial render");
  const [search, setSearch] = React.useState("");
  return (
    <List onSearchTextChange={setSearch}>
      <SearchList search={search} />
    </List>
  );
}

function SearchList({ search }: { search: string }) {
  const result = cacheManager.usePromise(() => runSearch(search), [search]);
  console.log("render result", result);

  return (
    <List.Item
      icon="list-icon.png"
      title={"Greeting: " + result}
      actions={
        <ActionPanel>
          <Action.Push title="Show Details" target={<Detail markdown="# Hey! 👋" />} />
        </ActionPanel>
      }
    />
  );
}

const cacheManager = getCacheManager<string>();

async function runSearch(search: string): Promise<string> {
  const p = wait(5000)
    .then(() => console.log(search))
    .then(() => search);
  return p;
}
function wait(numMillis: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, numMillis));
}
