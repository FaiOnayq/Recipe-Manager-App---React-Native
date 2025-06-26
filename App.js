import React, { useState } from "react";
import { Button, View, Text, Alert, Image, FlatList, StyleSheet, RefreshControl, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db } from "./firebaseConfig";
import { doc, setDoc, collection, getDocs, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { uid } from "uid";



const HomeStack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState(null);


  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, 'Recipes'));
    const dataList = [];
    querySnapshot.forEach((doc) => {
      dataList.push({ id: doc.id, ...doc.data() });
    });
    setData(dataList);
  };

  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, "Recipes", userId));
      setData((prevData) => prevData.filter((item) => item.id !== userId)); // Remove item from UI
      setEditingId(null);
      Alert.alert("Success", "You are successfully delete the recipe");
    } catch (error) {
      console.error("Error deleting document: ", error);
      Alert.alert("Error", "Failed to delete user");
    }
  };



  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => {
      setRefreshing(false);
    });
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  const handleImage = (img) => {
    img == "spaghetti" ? "./assets/spaghetti.jpeg" : null;
    img == "alfredo" ? "./assets/alfredo.jpeg" : null;
    img == "vegetable" ? "./assets/vegetable.jpeg" : null;

  };

  return (
    <View onLayout={fetchData} style={styles.container}>
      <Text style={styles.title}>Resturant Recipes</Text>
      <Button title="Add new recipe" onPress={() => navigation.navigate("Add Receipe")} />
      <View style={styles.inputContainer}>

      </View>
      <FlatList
        data={data}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View> 
            <Image source={resolveImagePath(item.image)} style={styles.imageHome} />
            <View style={styles.item}>

            <View style={styles.del}>

              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.text}>{item.desc}</Text>
              <Ionicons
                name={"pencil-sharp"}
                size={20}
                color={"red"}
                onPress={() => navigation.navigate("Edit Receipe", { name: item.name, id: item.id, desc: item.desc, image: item.image })}
              />
              <Ionicons
                name={"trash-bin-outline"}
                size={20}
                color={"red"}
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </View>
          </View>
        )}
      />
    </View>
  );

}

function resolveImagePath(imageName) {
  switch (imageName) {
    case 'spaghetti':
      return require('./assets/spaghetti.jpeg');
    case 'alfredo':
      return require('./assets/alfredo.jpeg');
    case 'vegetable':
      return require('./assets/vegetable.jpeg');
  }
}

function AddScreen({ navigation }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("spaghetti");



  const addRecipe = () => {
    const uuId = uid();
    setDoc(doc(db, "Recipes", uuId), {
      name: name,
      desc: desc,
      image: image,
      id: uuId,
    })
      .then(() => {
        console.log("Data added");
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Recipe Name"
      />

      <TextInput
        style={styles.input}
        value={desc}
        onChangeText={setDesc}
        placeholder="Recipe Description"
      />

      <Text style={styles.label}>Choose Recipe image:</Text>
      <View style={styles.del}>
        <TouchableOpacity style={styles.radioButton} onPress={() => setImage("spaghetti")}>
          <View style={styles.radioCircle}>
            <Image style={styles.image} source={require('./assets/spaghetti.jpeg')} />
            {image === "spaghetti" && <View style={styles.selectedRb} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.radioButton} onPress={() => setImage("alfredo")}>
          <View style={styles.radioCircle}>
            <Image style={styles.image} source={require('./assets/alfredo.jpeg')} />
            {image === "alfredo" && <View style={styles.selectedRb} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.radioButton} onPress={() => setImage("vegetable")}>
          <View style={styles.radioCircle}>
            <Image style={styles.image} source={require('./assets/vegetable.jpeg')} />
            {image === "vegetable" && <View style={styles.selectedRb} />}
          </View>
        </TouchableOpacity>
      </View>


      {/* Add User Button */}
      <Button title="Add Recipe" onPress={addRecipe} />
    </View>
  );

}

function EditScreen({ navigation, route }) {
  const [name, setName] = useState(route.params.name);
  const [desc, setDesc] = useState(route.params.desc);
  const [image, setImage] = useState(route.params.image);
  const [id, setId] = useState(route.params.id);

  const handleUpdateTask = () => {
    setDoc(doc(db, "Recipes", id), {
      name: name,
      desc: desc,
      image: image,
    })
      .then(() => {
        console.log("Data added");
        navigation.goBack()
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });

  }



  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Recipe Name"
      />

      <TextInput
        style={styles.input}
        value={desc}
        onChangeText={setDesc}
        placeholder="Recipe Description"
      />

      <Text style={styles.label}>Choose Recipe image:</Text>
      <View style={styles.del}>
        <TouchableOpacity style={styles.radioButton} onPress={() => setImage("spaghetti")}>
          <View style={styles.radioCircle}>
            <Image style={styles.image} source={require('./assets/spaghetti.jpeg')} />
            {image === "spaghetti" && <View style={styles.selectedRb} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.radioButton} onPress={() => setImage("alfredo")}>
          <View style={styles.radioCircle}>
            <Image style={styles.image} source={require('./assets/alfredo.jpeg')} />
            {image === "alfredo" && <View style={styles.selectedRb} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.radioButton} onPress={() => setImage("vegetable")}>
          <View style={styles.radioCircle}>
            <Image style={styles.image} source={require('./assets/vegetable.jpeg')} />
            {image === "vegetable" && <View style={styles.selectedRb} />}
          </View>
        </TouchableOpacity>
      </View>


      {/* Add User Button */}
      <Button title="Add Recipe" onPress={handleUpdateTask} />
    </View>
  );

}




export default function App() {
  return (
    <NavigationContainer>
      <HomeStack.Navigator initialRouteName="Recipes" >
        <HomeStack.Screen name="Recipes" component={HomeScreen} options={{ headerTitleAlign: 'center' }} />
        <HomeStack.Screen name="Add Receipe" component={AddScreen} options={{ headerTitleAlign: 'center' }} />
        <HomeStack.Screen name="Edit Receipe" component={EditScreen} options={{ headerTitleAlign: 'center' }} />
      </HomeStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  imageHome: {
    width: "100%",
    height: 150,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: 'blue',
    fontStyle: 'underline',
    fontSize: 16,
    marginLeft: 10,
  },
  buttonTextDis: {
    color: 'grey',
    fontStyle: 'underline',
    fontSize: 16,
    marginLeft: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  del: {
    flexDirection: 'row',
    gap: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  text: {
    flex: 1,
    width: 100,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioCircle: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 110,
    width: 110,
    borderWidth: 2,
    borderColor: "grey",
    marginRight: 5,
  },
  selectedRb:{
    position: "absolute",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 110,
    width: 110,
    borderWidth: 2,
    borderColor: "skyblue",
    marginRight: 5,
  }



})

