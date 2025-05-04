import React, { useState, useEffect} from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TodoContext } from "../context/TodoProvider";
import { useContext } from "react";
import { ActivityIndicator } from "react-native-paper";

import {
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  Appbar
} from "react-native-paper";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

export default function TodoList() {
  const [visible, setVisible] = React.useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const {updateTodo,createTodo,todos,refreshTodos,deleteTodo,loading} = useContext(TodoContext)
  
  useEffect(() => {
   
    refreshTodos()
 },[])

  const renderItem = ({ item }) => {
    const renderRightActions = () => (
      <View style={styles.rightAction}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </View>
    );

   
    return (
      <Swipeable
        friction={2}
        overshootRight={false}
        renderRightActions={renderRightActions}
        rightThreshold={80}
        onSwipeableOpen={(direction) => {
          if (direction === "right") {
            deleteItem(item.id);
          }
        }}
      >
        <View style={styles.item}>
          <Text>{item.name}</Text>
          <Button
            mode="contained-tonal"
            onPress={() => editItem(item)}
            style={styles.optionButton}
          >
            Edit
          </Button>
        </View>
      </Swipeable>
    );
  };
  const addItem = () => {
    setCurrentItem(null);
    setInputValue("");
    setVisible(true);
  };
  
  const saveItem =async () => {
    if (currentItem) {
      // Edit existing item
      console.log("currentItem",currentItem)
      await updateTodo({ id: currentItem.id, name: inputValue })
    } else {
      // Add new item
      const newItem = {
     
        name: inputValue
      };
      await createTodo(newItem)
     
    }
    setVisible(false);
  };

  const editItem = (item) => {
    setCurrentItem(item);
    setInputValue(item.name);
    setVisible(true);
  };


  const deleteItem = async (id) => {
    await deleteTodo(id);
    
  };

  if (loading === true) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
        <Text>Loading todos...</Text>
      </SafeAreaView>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Todo List" />
      </Appbar.Header>
      <View style={{ flex: 1 }}>
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 4 }}
        />
        <FAB style={styles.fab} icon="plus" color="white" onPress={addItem} />
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          animationType="slide"
          contentContainerStyle={styles.bottomSheetStyle}
          onRequestClose={() => setVisible(false)}
        >
          <TextInput
            style={styles.input}
            placeholder="Enter TODO item"
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={saveItem}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <Button
              mode="outlined"
              onPress={saveItem}
              style={styles.optionButton}
            >
              Save
            </Button>

            <Button
              mode="outlined"
              onPress={() => setVisible(false)}
              style={styles.optionButton}
            >
              Cancel
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: "#ddd",
    borderRadius: 5
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#6200ee"
  },
  optionButton: {
    marginVertical: 5
  },
  bottomSheetStyle: {
    backgroundColor: "white",
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  },
  input: {
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 10
  },
  rightAction: {
    width: 80, // must match rightThreshold
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 8,
    marginHorizontal: 16
  },
  deleteText: {
    color: "white",
    fontWeight: "bold"
  }
});
