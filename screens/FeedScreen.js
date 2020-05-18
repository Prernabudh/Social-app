import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  FlatList,
  Image,
} from "react-native";
import Fire from "../fire";
import { Ionicons } from "@expo/vector-icons";

const firebase = require("firebase");
require("firebase/firestore");

export default class FeedScreen extends Component {
  state = {
    posts: [],
  };
  handleFeed = () => {
    var listOfObjects = [];
    var singleObj = {};
    Fire.shared
      .getData()
      .then((ref) => {
        console.log("data goes here", ref);
        ref.forEach((documentSnapshot) => {
          var singleObj = {};
          singleObj["id"] = documentSnapshot.id;
          singleObj["image"] = documentSnapshot.data().image;
          singleObj["text"] = documentSnapshot.data().text;
          listOfObjects.push(singleObj);
        });
        this.setState({ posts: listOfObjects });
      })
      .catch((error) => {
        alert(error);
      });
  };

  get firestore() {
    return firebase.firestore();
  }

  renderPost = (post) => {
    return (
      <View style={styles.feedItem}>
        <Image
          source={require("../assets/avatar.jpg")}
          style={styles.avatar}
        ></Image>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <View>
              <Text style={styles.name}>Prerna</Text>
              <Text style={styles.timestamp}>1234567</Text>
            </View>
          </View>
          <Text style={styles.post}>{post.text}</Text>

          <Image
            source={{
              uri: post.image,
            }}
            style={styles.postImage}
            resizeMode="cover"
          ></Image>

          <View styles={{ flex: 1, flexDirection: "row" }}>
            <Ionicons
              name="ios-heart-empty"
              size={24}
              color="#73788B"
              style={{ marginRight: 16 }}
            />
          </View>
        </View>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={this.handleFeed}>
            <Text>Feed, touch to load</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={styles.feed}
          data={this.state.posts}
          renderItem={({ item }) => this.renderPost(item)}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        ></FlatList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#EFECF4",
  },
  header: {
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EBECF4",
    shadowColor: "#454D65",
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  feed: {
    marginHorizontal: 16,
  },
  feedItem: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 16,
  },
  post: {
    marginTop: 16,
    fontSize: 14,
  },

  postImage: {
    width: undefined,
    height: 150,
    borderRadius: 5,
    marginVertical: 16,
  },
});
