const url = '/api/acars';

axios.get(url).then((response) => {
  console.log(response.data);
})