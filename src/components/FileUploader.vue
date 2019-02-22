<template>
  <div>
    <input type="file" accept="image/jpeg" @change="detectFiles($event.target.files)">
    <div class="progress-bar" :style="{ width: progressUpload + '%'}">{{ progressUpload }}%</div>
  </div>
</template>

<script>
const { storage } = require("../firebaseConfig.js");
export default {
  props: ["post-id"],
  data() {
    return {
      progressUpload: 0,
      file: File,
      uploadTask: ""
    };
  },
  methods: {
    detectFiles(file) {
      this.upload(file);
    },
    upload(file) {
      this.uploadTask = storage.ref(post.id).put(file);
    }
  },
  watch: {
    uploadTask: function() {
      this.uploadTask.on(
        "state_changed",
        sp => {
          this.progressUpload = Math.floor(
            (sp.bytesTransferred / sp.totalBytes) * 100
          );
        },
        null,
        () => {
          this.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.$emit("url", downloadURL);
          });
        }
      );
    }
  }
};
</script>

<style>
.progress-bar {
  margin: 10px 0;
}
</style>