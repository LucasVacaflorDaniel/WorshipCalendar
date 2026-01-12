import CalendarView from "../components/CalendarView";
import { useStore } from '../src/store';

export default function Index() {
  const store = useStore();
  return <CalendarView store={store} />
}