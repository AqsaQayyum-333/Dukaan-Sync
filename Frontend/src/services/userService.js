import axios from "axios";

const API = "http://localhost:5000/api/users";

const getToken = () => localStorage.getItem("token");

export const getUsers = async () => {
  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};

export const createUser =
async(data)=>{

const res =
await axios.post(
API,
data,
{
headers:{
Authorization:
`Bearer ${getToken()}`
}
}
);

return res.data;
};

export const updateUser =
async(id,data)=>{

const res =
await axios.put(
`${API}/${id}`,
data,
{
headers:{
Authorization:
`Bearer ${getToken()}`
}
}
);

return res.data;
};

export const deleteUser =
async(id)=>{

const res =
await axios.delete(
`${API}/${id}`,
{
headers:{
Authorization:
`Bearer ${getToken()}`
}
}
);

return res.data;
};