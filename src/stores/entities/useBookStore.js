import axios from "@/libs/axios.js";
import { defineStore } from "pinia";

const defaultState = {
  book: {},
  books: [],
  loading: false,
};

export const useBookStore = defineStore({
  id: "bookStore",
  state: () => ({ ...defaultState }),
  getters: {
    getLoading: (state) => state.loading,
    getBook: (state) => state.book,
    getBooks: (state) => state.books,
  },
  actions: {
    async fetchBooks() {
      this.loading = true;

      const response = await axios.get("/books");
      const { data } = response;

      setTimeout(() => {
        if (data.meta.total) {
          this.books = data.data;
        }
        this.loading = false;
      }, 200);
    }
  },
});