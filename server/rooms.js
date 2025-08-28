// roomsオブジェクトと問題管理関数
const rooms = {};

// Firestoreから全問題取得
async function getAllQuestions(admin) {
	const db = admin.firestore();
	const snapshot = await db.collection("questions").get();
	return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

module.exports = {
	rooms,
	getAllQuestions
};
