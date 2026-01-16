import { useState } from 'react';
import { Alert } from 'react-native';
import { useSubscriptionStore } from '../store';
import { router } from 'expo-router';

export const usePaywall = () => {
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState<string>('');
  const { plan } = useSubscriptionStore();

  const checkLimitAndShowPaywall = (
    feature: 'medications' | 'tasks' | 'familyMembers',
    onProceed: () => void
  ) => {
    const { checkFeatureLimit, canAddMore } = useSubscriptionStore.getState();
    const canAdd = checkFeatureLimit(feature);

    if (canAdd) {
      onProceed();
      return true;
    }

    // Show paywall
    const featureName = feature === 'familyMembers' ? 'Family Members' : 
                       feature.charAt(0).toUpperCase() + feature.slice(1);
    
    setPaywallFeature(featureName);
    setShowPaywall(true);
    return false;
  };

  const handleUpgrade = (period: 'monthly' | 'yearly') => {
    setShowPaywall(false);
    // Navigate to subscription plans screen
    router.push('/subscription/plans' as any);
  };

  const closePaywall = () => {
    setShowPaywall(false);
  };

  return {
    showPaywall,
    paywallFeature,
    checkLimitAndShowPaywall,
    handleUpgrade,
    closePaywall,
  };
};
