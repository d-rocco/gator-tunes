import { UserContext } from "./contexts/googleuser.context";
import { useContext, useEffect, useState } from "react";
import TopTracks from "./TopTracks";
import TopArtists from "./TopArtists";
import { db } from "./firebase/firebase";
import {
  doc,
  addDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { Container } from "react-bootstrap";

//gets user's spotify data out of Firestore, to be used on profile/dashboard
const GetProfileData = () => {
  //gets currently logged in Google user
  const { currentUser } = useContext(UserContext);

  //state variables for all of the data we get from firestore
  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");
  const [userTopTracks, setUserTopTracks] = useState([]);
  const [userTopArtists, setUserTopArtists] = useState([]);
  const [userSpotifyURL, setUserSpotifyURL] = useState("");

  useEffect(() => {
    const getFireStoreData = async () => {
      //gets tracks
      const trackQuery = query(
        collection(db, "tracks"),
        where("userID", "==", currentUser.uid)
      );
      const trackQuerySnapshot = await getDocs(trackQuery);

      //gets artists
      const artistQuery = query(
        collection(db, "artists"),
        where("userID", "==", currentUser.uid)
      );
      const artistQuerySnapshot = await getDocs(artistQuery);

      //get user info
      const userInfoRef = doc(db, "userinfo", currentUser.uid);
      const userInfoSnapshot = await getDoc(userInfoRef);
      setUserImage(userInfoSnapshot.data().profilePicture);
      setUsername(userInfoSnapshot.data().name);
      setUserSpotifyURL(userInfoSnapshot.data().profileUrl);

      //get tracks
      trackQuerySnapshot.forEach((doc) => {
        userTopTracks.push(doc.data());
      });

      //get artists
      artistQuerySnapshot.forEach((doc) => {
        userTopArtists.push(doc.data());
      });

      console.log(userTopTracks);
      console.log(userTopArtists);
      console.log(userImage);
    };

    getFireStoreData();
  }, []);

  return (
    <Container className="profile-container">
      <div className="favorites-container">
        <div className="my-top-text">My top tracks:</div>
        <div className="top-tracks-container">
          {userTopTracks.map((track) => (
            <TopTracks track={track} key={track.uri} />
          ))}
        </div>
      </div>

      <div className="my-top-text">My top artists:</div>
      <div className="top-artists-container">
        {userTopArtists.map((artist) => (
          <TopArtists artist={artist} key={artist.uri} />
        ))}
      </div>

      <div className="my-top-text">My top genres:</div>
      <div className="top-genres-container">
        {userTopArtists.map((artist) => (
          <div className="genre">{artist.genre}</div>
        ))}
      </div>
    </Container>
  );
};

export default GetProfileData;
//<TopTracks track={track} key={track.uri} />
