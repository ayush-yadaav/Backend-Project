// it is complex 
const asyncHandler = (reqHandler) => {
   return (req, res, next) =>{
        Promise.resolve(reqHandler(req, res, next))
        .catch((err)=> next(err))
    }
}



export {asyncHandler}

// const asyncHandler = ()=> {}
// const asyncHandler = (func)=> () => {}
// const asyncHandler = (func)=> async () => {}

// for learning || we can also used this 

// const asyncHandler = (fn)=> async (req,res, next) => { // it is call higher function 
// try{
//     await fn(req ,res, next)

// }catch(err){
//     res.status(err.code || 500).json({
//         sucess: false,
//         message: err.message
//     })  
// }
// }
