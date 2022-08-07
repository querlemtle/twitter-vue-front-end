// todo: 嘗試 sweetalert2 更改樣式
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

import axios from 'axios'

// const baseURL = 'http://localhost:3000/api'
const baseURL = 'https://simpletwitter-2206.herokuapp.com/api'

export const apiHelper = axios.create({
  baseURL
})

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})

