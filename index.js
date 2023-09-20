const erc20min=require("./abis/IERC20Minimal.json")
var cron = require('node-cron');
const serviceAccount=require("./firebase/service-account-firebase.json")
const admin = require("firebase-admin");
const http = require('http');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://aadharcardscanner-72071.firebaseio.com",
  });


// dotenv.config({ path: 'config.env' });

const server = http.createServer();

const PORT = process.env.PORT || 7003;

const changeState=async(id)=>{
      const db=admin.firestore();
      try{
            const userRef = db.collection('users').doc(id);
            const userDoc = await userRef.get();
            const isEligible =userDoc.data().isEligible
            const paperToken=userDoc.data().paperBalance

            if(paperToken <10000){
                db.collection('users').doc(id).update({
                                            freeTx:7,
                                            isEligible:true
                                            })
            }else{
                db.collection('users').doc(id).update({
                    premium:true,
                    isEligible:true
                })

            }

            console.log(userDoc.data(),"data")
      }catch(e){
        console.log(e)
      }

}

const checkTransactionStatus=async()=>{
     try{
        const db=admin.firestore();
        const userRef = db.collection('users');
        const snapshot = await userRef.get();
        const users=[]
         snapshot.forEach(doc=>{
            
           changeState(doc.id)
             
         })
        // snapshot.forEach(doc => {
        //   console.log(doc.id, '=>', doc.data());
        // //    users.push({id:doc.id,
          
        // //     username:doc.data().username,
        // //     wallet:doc.data().wallet,
        // //     trades:doc.data().trades,
        // //     tradedPairs:doc.data().tradedPairs,
        // //     balance:doc.data().balance} )

        // });

      }catch(e){
        console.log(e)
        throw new Error(e.message)
      }

} 

checkTransactionStatus()
// cron.schedule('0 0 * * 1', () => {
//     console.log('running a task every minute');
    
// });


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});

