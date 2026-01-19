import{d as u,l as d,a,b as e,h as s,m as l,n as i,o,_ as c}from"./index-B9-UWCII.js";const p={class:"spec-content"},g={class:"tabs"},v={class:"tab-header"},m={key:0,class:"tab-content"},f={key:1,class:"tab-content"},y={key:2,class:"tab-content"},b=u({__name:"Querying",setup(C){const t=d("net");return(N,n)=>(o(),a("div",p,[n[6]||(n[6]=e("h1",null,"Querying",-1)),n[7]||(n[7]=e("p",{class:"lead"},"EntglDb provides a rich query interface for local collections, supporting idiomatic usage across .NET, Node.js, and Kotlin.",-1)),n[8]||(n[8]=e("div",{class:"alert info"},[e("strong",null,"Note:"),s(" Querying is performed locally on the device (or server) against the replicated data. ")],-1)),n[9]||(n[9]=e("h2",null,"Query Syntax",-1)),e("div",g,[e("div",v,[e("button",{class:i({active:t.value==="net"}),onClick:n[0]||(n[0]=r=>t.value="net")},".NET",2),e("button",{class:i({active:t.value==="node"}),onClick:n[1]||(n[1]=r=>t.value="node")},"Node.js",2),e("button",{class:i({active:t.value==="kotlin"}),onClick:n[2]||(n[2]=r=>t.value="kotlin")},"Kotlin",2)]),t.value==="net"?(o(),a("div",m,[...n[3]||(n[3]=[e("h3",null,"C# / .NET",-1),e("p",null,"Use standard LINQ expressions to query collections.",-1),e("pre",null,[e("code",{class:"language-csharp"},`// Simple Match
var users = await peerStore.GetCollection<User>("users");
var fabio = await users.Find(u => u.FirstName == "Fabio");

// Complex Logic
var adults = await users.Find(u => u.Age >= 18 && u.IsActive);`)],-1)])])):l("",!0),t.value==="node"?(o(),a("div",f,[...n[4]||(n[4]=[e("h3",null,"Node.js / TypeScript",-1),e("p",null,"Use a MongoDB-like object syntax for flexible querying.",-1),e("pre",null,[e("code",{class:"language-typescript"},`// Simple Match
const users = await peerStore.getCollection('users');
const fabio = await users.find({ firstName: 'Fabio' });

// Complex Logic
const adults = await users.find({ 
  age: { $gte: 18 },
  isActive: true
});`)],-1)])])):l("",!0),t.value==="kotlin"?(o(),a("div",y,[...n[5]||(n[5]=[e("h3",null,"Kotlin (Android/JVM)",-1),e("p",null,"Use the type-safe DSL for a clean, idiomatic experience.",-1),e("pre",null,[e("code",{class:"language-kotlin"},`// Simple Match
val users = peerStore.getCollection("users")
val fabio = users.find { "firstName" eq "Fabio" }

// Complex Logic
val adults = users.find { 
    "age" gte 18
    and { "isActive" eq true } 
}`)],-1)])])):l("",!0)]),n[10]||(n[10]=e("h2",null,"Serialization Consistency",-1)),n[11]||(n[11]=e("p",null,[s(" EntglDb automatically handles the mapping between your code's property naming convention (e.g., "),e("code",null,"camelCase"),s(" or "),e("code",null,"PascalCase"),s(") and the stored JSON format (e.g., "),e("code",null,"snake_case"),s("), ensuring seamless querying regardless of the underlying serialization strategy. ")],-1))]))}}),x=c(b,[["__scopeId","data-v-6a627b05"]]);export{x as default};
