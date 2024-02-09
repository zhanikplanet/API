const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://zhanikplanet1:narutoplanet@cluster0.zyfk98y.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function connectMongoDB() {
    try {

        await client.connect();
        console.log("Connected to MongoDB!");
        return client;
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
}

async function getStudents() {
    try {
        const database = client.db("E-learningPlatform");
        const collection = database.collection("Students");
        const students = await collection.find().toArray();
        return students;
    } catch (error) {
        console.error("Error retrieving students:", error);
        throw error;
    }
}
async function postStudents(name, email, age) {
    try {
        // Check if required parameters are provided
        if (!name || !email || !age) {
            throw new Error("Missing required parameters");
        }

        const database = client.db("E-learningPlatform");
        const collection = database.collection("Students");

        const result = await collection.insertOne({ name, email, age });

        if (result && result.insertedCount > 0) {
            const insertedStudent =console.log('You Succefully created Student');
            return insertedStudent;
        } else {
            throw new Error("No document inserted");
        }
    } catch (error) {
        console.error("Error creating student:", error);
        throw error;
    }
}

async function putStudents(email, name, age) {
    try {
      if (!email || !name || !age) {
        throw new Error("Missing required parameters");
      }
  
      const database = client.db("E-learningPlatform");
      const collection = database.collection("Students");
  
      const result = await collection.updateOne({ email }, { $set: { name, age } });
  
      if (result && result.modifiedCount > 0) {
        return { name, email, age }; 
      } else {
        throw new Error("No document updated");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  }


  async function deleteStudents(email) {
    try {
      if (!email) {
        throw new Error("Missing required parameters");
      }
  
      const database = client.db("E-learningPlatform");
      const collection = database.collection("Students");
  
      const result = await collection.deleteOne({ email });
      return result.deletedCount > 0; 
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  }
module.exports = { connectMongoDB, getStudents,postStudents,putStudents,deleteStudents };
