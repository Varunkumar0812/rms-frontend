import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";

export const useReviewStore = defineStore('review', () => {
    const reviews = ref([]);

    const fetchReviews = async () => {
        try {
            const data: any = (await axios.get("http://127.0.0.1:3333/review", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })).data;
            console.log(data);
            reviews.value = data;
        }
        catch (err) {
            console.log(err);
        }
    }


    const fetchUserReviews = async () => {
        try {
            console.log(localStorage.getItem("user_id"));

            const data: any = (await axios.get(`http://127.0.0.1:3333/review/user/${localStorage.getItem("user_id")}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })).data;
            console.log(data);
            reviews.value = data;
        }
        catch (err) {
            console.log(err);
        }
    }

    const deleteReview = async (id: any) => {
        try {
            const res = await axios.delete(`http://127.0.0.1:3333/review/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        }
        catch (err) {
            console.log(err);

        }
    }

    const createReview = async (data: any) => {
        try {
            const res = await axios.post("http://127.0.0.1:3333/review", data, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
        }
        catch (err) {
            console.log(err);
        }
    }


    const editReview = async (data: any, id: any) => {
        try {
            const res = await axios.patch(`http://127.0.0.1:3333/review/${id}`, data, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
        }
        catch (err) {
            console.log(err);
        }
    }



    return { reviews, fetchReviews, fetchUserReviews, deleteReview, createReview, editReview }
})
