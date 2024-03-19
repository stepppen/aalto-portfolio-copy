// import jsonData from '/projects/projects.json';

export default defineEventHandler(async(event) => {
    console.log(jsonData)
    return {
        message: "Hello"
    }
})