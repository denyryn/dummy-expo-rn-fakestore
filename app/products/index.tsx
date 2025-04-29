import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { useProducts } from "@/hooks/useProducts";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function ProductsScreen() {
  const { width } = Dimensions.get("window");
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading products...</ThemedText>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        numColumns={2}
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/products/[id]",
              params: { id: item.id },
            }}
            asChild
          >
            <TouchableOpacity>
              <View style={[styles.card, { width: width / 2 - 24 }]}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.textContainer}>
                  <ThemedText style={styles.productTitle} numberOfLines={2}>
                    {item.title}
                  </ThemedText>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.productPrice}
                  >
                    ${item.price.toFixed(2)}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText>No products found</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 18,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  row: {
    gap: 16,
  },
  card: {
    backgroundColor: "transparent",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    flex: 1,
  },
  imageContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  productTitle: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 16,
    color: "#007AFF",
  },
});
