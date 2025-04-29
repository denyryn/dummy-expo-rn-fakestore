// app/(tabs)/product/[id].tsx
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  useColorScheme,
  Platform,
} from "react-native";
import { useProductDetail } from "@/hooks/useProductDetails";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { addToCart } from "@/store/slices/cartSlice";
import { useDispatch } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useState, useEffect, useRef } from "react";
// import { formatCurrency } from "@/utils/formatCurrency";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const productId = Number(id);
  const dispatch = useDispatch();
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const colorScheme = useColorScheme() ?? "light";
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const { product, loading, error } = useProductDetail(productId);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
      setShowAddedNotification(true);

      // Add a little "bounce" effect to the button
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  useEffect(() => {
    if (showAddedNotification) {
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start(() => {
          setShowAddedNotification(false);
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showAddedNotification]);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
        <ThemedText style={styles.loadingText}>
          Loading product details...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <FontAwesome
          name="exclamation-circle"
          size={48}
          color={Colors[colorScheme].tint}
        />
        <ThemedText type="title" style={styles.errorTitle}>
          Oops!
        </ThemedText>
        <ThemedText style={styles.errorText}>
          {error.message || "Failed to load product details"}
        </ThemedText>
      </ThemedView>
    );
  }

  if (!product) {
    return (
      <ThemedView style={styles.errorContainer}>
        <FontAwesome
          name="question-circle"
          size={48}
          color={Colors[colorScheme].tint}
        />
        <ThemedText type="title" style={styles.errorTitle}>
          Not Found
        </ThemedText>
        <ThemedText style={styles.errorText}>
          The product you're looking for doesn't exist
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.imageContainer,
              { backgroundColor: Colors.light.background },
            ]}
          >
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="contain"
              accessibilityLabel={product.title}
            />
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.header}>
              <ThemedText type="title" style={styles.productTitle}>
                {product.title}
              </ThemedText>
              <ThemedText
                type="title"
                style={[
                  styles.productPrice,
                  { color: Colors[colorScheme].tint },
                ]}
              >
                ${product.price.toFixed(2)}
              </ThemedText>
            </View>

            <View
              style={[
                styles.divider,
                { backgroundColor: Colors[colorScheme].tint },
              ]}
            />

            <View style={styles.descriptionContainer}>
              <ThemedText
                type="subtitle"
                style={[
                  styles.sectionTitle,
                  { color: Colors[colorScheme].tint },
                ]}
              >
                Description
              </ThemedText>
              <ThemedText style={styles.descriptionText}>
                {product.description}
              </ThemedText>
            </View>

            <View style={styles.ratingContainer}>
              <View
                style={[
                  styles.ratingBadge,
                  { backgroundColor: Colors[colorScheme].background },
                ]}
              >
                <FontAwesome
                  name="star"
                  size={16}
                  color={Colors[colorScheme].tint}
                />
                <ThemedText style={styles.ratingText}>
                  {product.rating?.rate || "N/A"}
                </ThemedText>
              </View>
              <ThemedText style={styles.ratingCount}>
                ({product.rating?.count || 0} reviews)
              </ThemedText>
            </View>
          </View>
        </ScrollView>

        {showAddedNotification && (
          <Animated.View
            style={[
              styles.notification,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                  { scale: scaleAnim },
                ],
                backgroundColor: Colors[colorScheme].tint,
                borderColor: Colors[colorScheme].background,
              },
            ]}
          >
            <FontAwesome
              name="check-circle"
              size={24}
              color={Colors[colorScheme].background}
            />
            <ThemedText
              style={[
                styles.notificationText,
                { color: Colors[colorScheme].background },
              ]}
            >
              Added to cart!
            </ThemedText>
          </Animated.View>
        )}

        <View
          style={[
            styles.footer,
            {
              backgroundColor: Colors[colorScheme].background,
              borderTopColor: Colors[colorScheme].tint,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              { backgroundColor: Colors[colorScheme].tint },
            ]}
            onPress={handleAddToCart}
            activeOpacity={0.7}
            accessibilityLabel="Add to cart"
            accessibilityRole="button"
          >
            <FontAwesome
              name="shopping-cart"
              size={20}
              color={Colors[colorScheme].background}
            />
            <ThemedText
              style={[
                styles.addToCartText,
                { color: Colors[colorScheme].background },
              ]}
            >
              Add to Cart
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 20,
  },
  errorTitle: {
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  imageContainer: {
    alignItems: "center",
    padding: 20,
    borderRadius: 8,
    margin: 16,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  productImage: {
    width: "100%",
    height: 300,
    aspectRatio: 1,
  },
  detailsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginVertical: 8,
    gap: 16,
  },
  productTitle: {
    flex: 1,
    fontSize: 20,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  ratingCount: {
    fontSize: 14,
    opacity: 0.8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 20 : 30,
    borderTopWidth: 1,
  },
  addToCartButton: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  addToCartText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  notification: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  notificationText: {
    fontWeight: "600",
    fontSize: 16,
  },
});
