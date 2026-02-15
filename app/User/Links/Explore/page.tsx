import { Suspense } from "react";
import ExploreRooms from "./ExploreRooms";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExploreRooms />
    </Suspense>
  );
}
