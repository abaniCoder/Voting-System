const Dept = require("../Models/department");
const Candidate = require("../Models/candidate");
const User = require("../Models/user")

exports.loadVotingCandidates = async (userId) => {
    var votingCandidates = new Map();
    var department = [];
    var voters = undefined;
    try {
        const user = await User.findOne({ id: userId });
        if (user) {
            voters = user;
        }
    } catch (error) {
       // console.log(error);
    }
     console.log(voters); 

    // finds all department with selected true 
    try {
      department = await Dept.find({ selected: true });
        
    } catch (error) {
        console.log(error);
    }
    // find all candidates with that department  
    //console.log(department);
    if (Array.isArray(department)) {
      
        for (const dept of department) {
            console.log(dept.name);
            if (voters && !voters.voted.get(dept.name)) {
               // console.log(voters.voted.get(dept.name));
                try {
                    const candidate = await Candidate.find({ department: dept.name });
                    votingCandidates.set(dept, candidate);
                } catch (error) {
                    console.log(error);
                    votingCandidates.set(dept, []);
                }
            }
        }
    }    
    return votingCandidates; 
}