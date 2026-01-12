import MusiciansView from "../components/MusiciansView";
import { useStore } from '../src/store';

export default function Index() {
  const store = useStore();
  return <MusiciansView store={store} />
}