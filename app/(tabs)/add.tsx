// This screen is handled by the center button in CustomTabBar
// It navigates directly to /medication/new
// This file exists to prevent routing errors
import { Redirect } from 'expo-router';

export default function AddScreen() {
  return <Redirect href="/medication/new" />;
}

