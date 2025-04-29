import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { removeFromCart, clearCart } from "@/store/slices/cartSlice";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";

export default function CartScreen() {
  const colorScheme: string = useColorScheme() ?? "light";
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const goToDetails = (id: number) => {
    router.push({
      pathname: "/products/[id]",
      params: { id },
    });
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <ThemedView style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <FontAwesome
            name="shopping-cart"
            size={64}
            color={Colors.light.tint}
          />
          <ThemedText style={styles.emptyText}>Your cart is empty</ThemedText>
          <ThemedText style={styles.emptySubText}>
            Add some items to get started
          </ThemedText>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => goToDetails(item.id)}>
                <ThemedView
                  style={{
                    ...styles.card,
                    borderColor:
                      colorScheme === "light"
                        ? Colors.light.tint
                        : Colors.dark.tint,
                    backgroundColor:
                      colorScheme === "light"
                        ? Colors.light.background
                        : Colors.dark.background,
                  }}
                >
                  {item.image && (
                    <Image source={{ uri: item.image }} style={styles.image} />
                  )}
                  <View style={styles.itemInfo}>
                    <ThemedText style={styles.title} numberOfLines={2}>
                      {item.title}
                    </ThemedText>
                    <ThemedText
                      style={{
                        ...styles.price,
                        color:
                          colorScheme === "light"
                            ? Colors.light.tint
                            : Colors.dark.tint,
                      }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                      {item.quantity > 1 && (
                        <ThemedText
                          style={{
                            ...styles.quantity,
                            color:
                              colorScheme === "light"
                                ? Colors.light.tint
                                : Colors.dark.tint,
                          }}
                        >
                          {" "}
                          ({item.quantity} × ${item.price.toFixed(2)})
                        </ThemedText>
                      )}
                    </ThemedText>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemove(item.id)}
                    style={styles.removeButton}
                  >
                    <FontAwesome name="trash-o" size={28} color="#ff4444" />
                  </TouchableOpacity>
                </ThemedView>
              </TouchableOpacity>
            )}
          />
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <ThemedText style={styles.totalLabel}>Total:</ThemedText>
              <ThemedText
                style={styles.totalAmount}
                lightColor={
                  colorScheme === "light" ? Colors.light.tint : Colors.dark.tint
                }
              >
                ${calculateTotal()}
              </ThemedText>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => dispatch(clearCart())}
              >
                <Text style={styles.checkoutText}>Checkout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => dispatch(clearCart())}
              >
                <Text style={styles.clearText}>Clear Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyCart: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 16,
    color: "#666",
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 12,
    fontWeight: "normal",
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  checkoutButton: {
    flex: 1,
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 10,
  },
  checkoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  clearButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ff4444",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  clearText: {
    color: "#ff4444",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
});
