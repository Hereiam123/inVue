import Vue from "vue";
import Vuex from "vuex";
const fb = require("./firebaseConfig.js");

Vue.use(Vuex);

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit("setCurrentUser", user);
    store.dispatch("fetchUserProfile");
    fb.postsCollection
      .orderBy("createdOn", "desc")
      .onSnapshot(querySnapshot => {
        // check if created by currentUser
        let createdByCurrentUser;
        let changeData = querySnapshot.docChanges()[0];
        if (querySnapshot.docs.length) {
          console.log(changeData.doc.data());
          createdByCurrentUser =
            store.state.currentUser.uid == changeData.doc.data().userId
              ? true
              : false;
        }

        // add new posts to hiddenPosts array after initial load
        if (
          querySnapshot.docChanges().length !== querySnapshot.docs.length &&
          changeData.type == "added" &&
          !createdByCurrentUser
        ) {
          let post = changeData.doc.data();
          post.id = changeData.doc.id;

          store.commit("setHiddenPosts", post);
        } else {
          let postsArray = [];

          querySnapshot.forEach(doc => {
            let post = doc.data();
            post.id = doc.id;
            postsArray.push(post);
          });

          store.commit("setPosts", postsArray);
        }
      });
  }
});

export const store = new Vuex.Store({
  state: { currentUser: null, userProfile: {}, posts: [], hiddenPosts: [] },
  actions: {
    fetchUserProfile({ commit, state }) {
      fb.usersCollection
        .doc(state.currentUser.uid)
        .get()
        .then(res => {
          commit("setUserProfile", res.data());
        })
        .catch(err => {
          console.log(err);
        });
    },
    clearData({ commit }) {
      commit("setCurrentUser", null);
      commit("setUserProfile", {});
      commit("setPosts", null);
      commit("setHiddenPosts", null);
    }
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val;
    },
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setPosts(state, val) {
      if (val) {
        state.posts = val;
      } else {
        state.posts = [];
      }
    },
    setHiddenPosts(state, val) {
      if (val) {
        // make sure not to add duplicates
        if (!state.hiddenPosts.some(x => x.id === val.id)) {
          state.hiddenPosts.unshift(val);
        }
      } else {
        state.hiddenPosts = [];
      }
    }
  }
});
