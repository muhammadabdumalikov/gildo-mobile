import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import {
  AnimatedHeader,
  Colors,
  Spacing,
  Typography,
  CubeSpinner,
} from "@/src/features/shared/components";
import { useSharedValue } from "react-native-reanimated";
import { paymentService } from "@/src/core/services/payment.service";
import { CheckmarkIcon, StarIcon, HandIcon, FlowerIcon } from "./plan-icons";
import { useSubscriptionStore } from "@/src/core/store/subscriptionStore";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - Spacing.lg * 2; // Full width minus padding
const CARD_SPACING = Spacing.lg;

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    price: string;
    period?: string;
    monthlyEquivalent?: string;
    icon: string;
    iconColor: string;
    backgroundColor: string;
    isPopular?: boolean;
    isSelected: boolean;
    features: string[];
  };
  onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps & { isProcessing?: boolean }> = ({
  plan,
  onSelect,
  isProcessing = false,
}) => {
  return (
    <View style={[styles.planCard, { backgroundColor: plan.backgroundColor }]}>
      {/* Decorative shapes */}
      <View style={styles.decorativeShapes}>
        <View style={[styles.shape, styles.shape1]} />
        <View style={[styles.shape, styles.shape2]} />
        <View style={[styles.shape, styles.shape3]} />
      </View>

      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: plan.iconColor }]}>
        {plan.id === "freemium" ? (
          <HandIcon size={60} />
        ) : plan.id === "yearly" ? (
          <FlowerIcon size={60} />
        ) : (
          <StarIcon size={80} />
        )}
      </View>

      {/* Plan name and badge */}
      <View style={styles.planTitleRow}>
        <Text style={styles.planName}>{plan.name}</Text>
        {plan.isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Popular</Text>
          </View>
        )}
      </View>

      {/* Features list */}
      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <CheckmarkIcon size={24} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Price */}
      <View style={styles.priceContainer}>
        <Text style={styles.planPrice}>{plan.price}</Text>
        {plan.period && <Text style={styles.planPeriod}>{plan.period}</Text>}
        {plan.monthlyEquivalent && (
          <Text style={styles.monthlyEquivalent}>
            {plan.monthlyEquivalent} per month
          </Text>
        )}
      </View>

      {/* Button or Current Plan Text */}
      {plan.isSelected ? (
        <View style={styles.currentPlanContainer}>
          <Text style={styles.currentPlanText}>Current Plan</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.chooseButton,
            isProcessing && styles.chooseButtonDisabled,
          ]}
          onPress={onSelect}
          activeOpacity={0.8}
          disabled={isProcessing}
        >
          <View style={styles.buttonContent}>
            {isProcessing ? (
              <CubeSpinner 
                size={32} 
                color={Colors.cardBackground}
              />
            ) : (
              <Text style={styles.chooseButtonText}>Choose Plan</Text>
            )}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

interface PlanData {
  id: string;
  name: string;
  price: string;
  period?: string;
  monthlyEquivalent?: string;
  icon: string;
  iconColor: string;
  backgroundColor: string;
  isPopular?: boolean;
  features: string[];
}

function getDefaultPlans(): PlanData[] {
  return [
    {
      id: "freemium",
      name: "Freemium",
      price: "Free",
      icon: "gift.fill",
      iconColor: "#FFB8A5",
      backgroundColor: "#FFFFFF",
      features: [
        "Up to 3 medications",
        "Up to 5 tasks & reminders",
        "1 family member",
        "Basic notifications",
        "Essential features included",
      ],
    },
    {
      id: "monthly",
      name: "Premium Monthly",
      price: "$4.99",
      period: "per month",
      icon: "star.fill",
      iconColor: "#A8B9E8",
      backgroundColor: "#E8D9FF",
      features: [
        "Unlimited medications",
        "Unlimited tasks & reminders",
        "Unlimited family members",
        "Cloud backup & sync",
        "Priority support",
        "Advanced notifications",
      ],
    },
    {
      id: "yearly",
      name: "Premium Yearly",
      price: "$39.99",
      period: "per year",
      monthlyEquivalent: "$3.33",
      icon: "flame.fill",
      iconColor: "#FFD666",
      backgroundColor: "#FFE8D6",
      isPopular: true,
      features: [
        "Unlimited medications",
        "Unlimited tasks & reminders",
        "Unlimited family members",
        "Cloud backup & sync",
        "Priority support",
        "Advanced notifications",
        "Save ~33% vs monthly plan",
      ],
    },
  ];
}

// Helper function to get plan ID from subscription store values
const getPlanIdFromSubscription = (
  plan: "freemium" | "premium",
  period?: "monthly" | "yearly"
): string => {
  if (plan === "freemium") {
    return "freemium";
  } else if (plan === "premium") {
    return period === "yearly" ? "yearly" : "monthly";
  }
  return "yearly"; // Default fallback
};

export default function SubscriptionPlansScreen() {
  const { plan, period, loadSubscription } = useSubscriptionStore();

  // Initialize state with persisted subscription store values (immediate, no delay!)
  const [selectedPlan, setSelectedPlan] = useState<string>(() =>
    getPlanIdFromSubscription(plan, period)
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const scrollY = useSharedValue(0);

  // Static plans - no need to fetch from backend
  const plans = getDefaultPlans();

  // Update selected plan when subscription store changes (from persisted data)
  useEffect(() => {
    const planId = getPlanIdFromSubscription(plan, period);
    if (planId !== selectedPlan) {
      setSelectedPlan(planId);
    }
  }, [plan, period, selectedPlan]); // Added selectedPlan to dependencies

  // Initialize payment service and sync selected plan from API
  useEffect(() => {
    // Run async initialization in background without blocking UI
    const initializeAsync = async () => {
      try {
        await paymentService.initialize();
        // Sync with API in background (for fresh data, but don't block UI)
        await syncSelectedPlan();
      } catch (error) {
        console.error("Failed to initialize payment service:", error);
      }
    };

    // Don't await - let it run in background
    initializeAsync();

    // Cleanup on unmount
    return () => {
      paymentService.disconnect();
    };
  }, []); // Empty deps - only run once on mount

  const syncSelectedPlan = async () => {
    try {
      const { subscriptionsApi } = await import("@/src/core/api/subscriptions");
      const savedPlanId = await subscriptionsApi.getSelectedPlan();
      if (savedPlanId && savedPlanId !== selectedPlan) {
        setSelectedPlan(savedPlanId);
      }
      // Refresh subscription status in background (uses cache, won't reload if recently loaded)
      await loadSubscription();
    } catch (error) {
      console.error("Failed to sync selected plan:", error);
    }
  };

  const handleSelectPlan = async (planId: string) => {
    // Set processing state for this specific plan
    setIsProcessing(true);
    setProcessingPlanId(planId);

    try {
      // Save selected plan to backend
      const { subscriptionsApi } = await import("@/src/core/api/subscriptions");
      await subscriptionsApi.selectPlan(
        planId as "freemium" | "monthly" | "yearly"
      );

      // Reload subscription status to get updated plan and limits (force reload)
      const { useSubscriptionStore } = await import(
        "@/src/core/store/subscriptionStore"
      );
      await useSubscriptionStore.getState().loadSubscription(true); // Force reload after plan change
      
      // Only update selectedPlan after successful API call
      setSelectedPlan(planId);
    } catch (error) {
      console.error("Failed to save selected plan:", error);
      // Don't show error to user, just log it
    } finally {
      setIsProcessing(false);
      setProcessingPlanId(null);
    }
  };

  const handleTerms = () => {
    Linking.openURL("https://example.com/terms");
  };

  const handlePrivacy = () => {
    Linking.openURL("https://example.com/privacy");
  };

  const renderPlanCard = ({
    item,
    index,
  }: {
    item: (typeof plans)[0];
    index: number;
  }) => (
    <PlanCard
      plan={{
        ...item,
        isSelected: selectedPlan === item.id,
      }}
      onSelect={async () => {
        // All plans behave the same: select with loading state, then navigate back
        await handleSelectPlan(item.id);
        router.back();
      }}
      isProcessing={isProcessing && processingPlanId === item.id}
    />
  );

  const getItemLayout = (_: any, index: number) => ({
    length: CARD_WIDTH + CARD_SPACING,
    offset: (CARD_WIDTH + CARD_SPACING) * index,
    index,
  });

  return (
    <View style={styles.container}>
      <AnimatedHeader
        title="Choose Your Plan"
        scrollY={scrollY}
        showBackButton
        showBottomBorder
        blurHeader={true}
        onBackPress={() => {
          router.back();
        }}
      />

      <View style={[styles.contentContainer]}>
        {/* Horizontal Plan Cards */}
        <FlatList
          data={plans}
          renderItem={renderPlanCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          snapToAlignment="start"
          decelerationRate="fast"
          pagingEnabled={false}
          getItemLayout={getItemLayout}
          contentContainerStyle={styles.plansListContainer}
          style={styles.plansList}
          removeClippedSubviews={false}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={5}
        />

        {/* Legal Links */}
        <View style={styles.legalContainer}>
          <TouchableOpacity onPress={handleTerms}>
            <Text style={styles.legalLink}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.legalSeparator}> and </Text>
          <TouchableOpacity onPress={handlePrivacy}>
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 120 + Spacing.md,
    paddingBottom: Spacing.xl,
  },
  plansList: {
    flexGrow: 0,
    marginTop: 0,
    marginBottom: Spacing.md,
  },
  plansListContainer: {
    paddingHorizontal: Spacing.lg,
  },
  planCard: {
    width: CARD_WIDTH,
    borderRadius: 28,
    padding: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
    marginRight: CARD_SPACING,
    position: "relative",
    overflow: "hidden",
    height: SCREEN_HEIGHT * 0.7,
    maxHeight: 600,
    justifyContent: "space-between",
  },
  decorativeShapes: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    overflow: "hidden",
  },
  shape: {
    position: "absolute",
    borderRadius: 100,
  },
  shape1: {
    width: 80,
    height: 80,
    backgroundColor: "#FFE066",
    top: 20,
    left: 20,
    transform: [{ rotate: "-15deg" }],
  },
  shape2: {
    width: 100,
    height: 100,
    backgroundColor: "#A8D8FF",
    top: -20,
    right: 30,
    borderRadius: 50,
  },
  shape3: {
    width: 60,
    height: 60,
    backgroundColor: "#FFB8D9",
    top: 80,
    right: 60,
    borderRadius: 30,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: Spacing.md,
    borderWidth: 3,
    borderColor: Colors.textPrimary,
    transform: [{ rotate: "15deg" }],
  },
  planTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  planName: {
    ...Typography.header,
    fontSize: 26,
    color: Colors.textPrimary,
    fontFamily: "Montserrat_700Bold",
    textAlign: "center",
  },
  popularBadge: {
    backgroundColor: "#FFE066",
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.textPrimary,
  },
  popularText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textPrimary,
    fontFamily: "Montserrat_600SemiBold",
  },
  featuresContainer: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
    flex: 1,
    minHeight: 0,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  featureText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 20,
    fontFamily: "Montserrat_400Regular",
  },
  priceContainer: {
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  planPrice: {
    ...Typography.header,
    fontSize: 36,
    color: Colors.textPrimary,
    fontFamily: "Montserrat_700Bold",
    textAlign: "center",
  },
  planPeriod: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: "Montserrat_400Regular",
    marginTop: Spacing.xs,
  },
  monthlyEquivalent: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.textPrimary,
    fontFamily: "Montserrat_600SemiBold",
    marginTop: Spacing.xs,
  },
  chooseButton: {
    backgroundColor: "#5B6FFF",
    paddingVertical: Spacing.lg,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.textPrimary,
    height: 56, // Fixed height to prevent resizing
  },
  buttonContent: {
    height: 32, // Fixed height for content (matches CubeSpinner size)
    alignItems: "center",
    justifyContent: "center",
  },
  chooseButtonDisabled: {
    opacity: 0.6,
  },
  chooseButtonText: {
    ...Typography.body,
    fontSize: 17,
    color: "#FFFFFF",
    fontFamily: "Montserrat_700Bold",
  },
  currentPlanContainer: {
    paddingVertical: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  currentPlanText: {
    ...Typography.body,
    fontSize: 17,
    color: Colors.textPrimary,
    fontFamily: "Montserrat_600SemiBold",
  },
  legalContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  legalLink: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textDecorationLine: "underline",
  },
  legalSeparator: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomPadding: {
    height: 100,
  },
});
