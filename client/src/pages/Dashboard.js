import { useState, useEffect } from "react";
import useAuth from "../useAuth";
import { Container } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import UserInfo from "../UserInfo";
import TopTracks from "../TopTracks";
import TopArtists from "../TopArtists";
import { UserContext } from "../contexts/googleuser.context";
import { useContext } from "react";

import { db } from "../firebase/firebase";
import {
  doc,
  addDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

import NavBar from "../components/Navbar";
import "../styles.css";
import About from "./about";
import ImportData from "../ImportData";
import GetProfileData from "../GetProfileData";

const spotifyApi = new SpotifyWebApi({
  clientId: "8ab7f351ac43415586fa613bb9e7fe62",
});

const Dashboard = ({ code }) => {
  const { currentUser } = useContext(UserContext);

  const accessToken = useAuth(code);
  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");
  const [userTopTracks, setUserTopTracks] = useState([]);
  const [userTopArtists, setUserTopArtists] = useState([]);
  const [userSpotifyURL, setUserSpotifyURL] = useState("");
  const [userArtistData, setUserArtistData] = useState([]);

  // for whenever access token changes
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  // get username and user image from API
  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.getMe().then(
      (res) => {
        setUserSpotifyURL(res.body.external_urls.spotify);
        setUsername(res.body.display_name);
        setUserImage(res.body.images[0].url);
      },
      (err) => {
        return null;
      }
    );
  }, [accessToken]);

  // get user's top tracks of all time
  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.getMyTopTracks({ limit: 5, time_range: "long_term" }).then(
      (res) => {
        setUserTopTracks(
          res.body.items.map((track) => {
            //console.log(track);
            return {
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumCoverUrl: track.album.images[0].url,
              trackID: track.id,
            };
          })
        );
      },
      (err) => {
        return null;
      }
    );
  }, [accessToken]);

  // get user's top artists of all time
  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.getMyTopArtists({ limit: 5, time_range: "long_term" }).then(
      (res) => {
        console.log(res.body.items);
        setUserArtistData(res.body.items);
        setUserTopArtists(
          res.body.items.map((artist) => {
            return {
              name: artist.name,
              pictureUrl: artist.images[0].url,
              uri: artist.uri,
              artistID: artist.id,
              genre: artist.genres[0],
            };
          })
        );
      },
      (err) => {
        return null;
      }
    );
  }, [accessToken]);

  const importSpotifyDataToFirestore = async () => {
    //add all of the data to firestore
    await setDoc(doc(db, "userinfo", `${currentUser.uid}`), {
      name: username,
      profilePicture: userImage,
      profileUrl: userSpotifyURL,
      userID: currentUser.uid,
    });

    userTopTracks.map(
      async (track) =>
        await setDoc(doc(db, "tracks", `${track.trackID}_${currentUser.uid}`), {
          artist: track.artist,
          title: track.title,
          uri: track.uri,
          albumCoverUrl: track.albumCoverUrl,
          userID: currentUser.uid,
        })
    );

    userTopArtists.map(
      async (artist) =>
        await setDoc(
          doc(db, "artists", `${artist.artistID}_${currentUser.uid}`),
          {
            name: artist.name,
            pictureUrl: artist.pictureUrl,
            uri: artist.uri,
            artistID: artist.artistID,
            userID: currentUser.uid,
            genre: artist.genre,
          }
        )
    );
  };

  //check if a document in userinfo with the currentuser.uid exists. if it
  //does, show profile. else show import data to firestore button
  return (
    <div>
      <button onClick={importSpotifyDataToFirestore}>
        Import Data to Firestore
      </button>
      <GetProfileData></GetProfileData>
      <Container className="profile-container">
        <div className="user-info-container">
          <UserInfo
            userURL={userSpotifyURL}
            username={username}
            userImage={userImage}
          />
        </div>

        <div className="favorites-container">
          <div className="my-top-text">My top tracks:</div>
          <div className="top-tracks-container">
            {userTopTracks.map((track) => (
              <TopTracks track={track} key={track.uri} />
            ))}
          </div>

          <div className="my-top-text">My top artists:</div>
          <div className="top-artists-container">
            {userTopArtists.map((artist) => (
              <TopArtists artist={artist} key={artist.uri} />
            ))}
          </div>
          <div className="my-top-text">My top genres:</div>
          <div className="top-genres-container">
            {userArtistData.map((artist) => (
              <div className="genre">{artist.genres[0]}</div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

{
  /* <div>
<Container className="profile-container">
  <div className="user-info-container">
    <UserInfo
      userURL={userSpotifyURL}
      username={username}
      userImage={userImage}
    />
  </div>
</Container>
<GetProfileData></GetProfileData>
</div> */
}

export default Dashboard;
//  <div className="favorites-container">
//           <div className="my-top-text">My top tracks:</div>
//           <div className="top-tracks-container">
//             {userTopTracks.map((track) => (
//               <TopTracks track={track} key={track.uri} />
//             ))}
//           </div>

//           <div className="my-top-text">My top artists:</div>
//           <div className="top-artists-container">
//             {userTopArtists.map((artist) => (
//               <TopArtists artist={artist} key={artist.uri} />
//             ))}
//           </div>
//           <div className="my-top-text">My top genres:</div>
//           <div className="top-genres-container">
//             {userArtistData.map((artist) => (
//               <div className="genre">{artist.genres[0]}</div>
//             ))}
//           </div>

// import { useState, useEffect } from "react";
// import useAuth from "../useAuth";
// import { Container } from "react-bootstrap";
// import SpotifyWebApi from "spotify-web-api-node";
// import UserInfo from "../UserInfo";
// import TopTracks from "../TopTracks";
// import TopArtists from "../TopArtists";

// import NavBar from "../components/Navbar";
// import "../styles.css";
// import About from "./about";

// const spotifyApi = new SpotifyWebApi({
//   clientId: "8ab7f351ac43415586fa613bb9e7fe62",
// });

// const Dashboard = ({ code }) => {
//   const accessToken = useAuth(code);
//   const [username, setUsername] = useState("");
//   const [userImage, setUserImage] = useState("");
//   const [userTopTracks, setUserTopTracks] = useState([]);
//   const [userTopArtists, setUserTopArtists] = useState([]);
//   const [userSpotifyURL, setUserSpotifyURL] = useState("");
//   const [userArtistData, setUserArtistData] = useState([]);

//   // for whenever access token changes
//   useEffect(() => {
//     if (!accessToken) return;
//     spotifyApi.setAccessToken(accessToken);
//   }, [accessToken]);

//   // get username and user image from API
//   useEffect(() => {
//     if (!accessToken) return;

//     spotifyApi.getMe().then(
//       (res) => {
//         setUserSpotifyURL(res.body.external_urls.spotify);
//         setUsername(res.body.display_name);
//         setUserImage(res.body.images[0].url);
//       },
//       (err) => {
//         return null;
//       }
//     );
//   }, [accessToken]);

//   // get user's top tracks of all time
//   useEffect(() => {
//     if (!accessToken) return;

//     spotifyApi.getMyTopTracks({ limit: 5, time_range: "long_term" }).then(
//       (res) => {
//         setUserTopTracks(
//           res.body.items.map((track) => {
//             return {
//               artist: track.artists[0].name,
//               title: track.name,
//               uri: track.uri,
//               albumUrl: track.album.images[0].url,
//             };
//           })
//         );
//       },
//       (err) => {
//         return null;
//       }
//     );
//   }, [accessToken]);

//   // get user's top artists of all time
//   useEffect(() => {
//     if (!accessToken) return;

//     spotifyApi.getMyTopArtists({ limit: 5, time_range: "long_term" }).then(
//       (res) => {
//         console.log(res.body.items);
//         setUserArtistData(res.body.items);
//         setUserTopArtists(
//           res.body.items.map((artist) => {
//             return {
//               name: artist.name,
//               url: artist.images[0].url,
//               uri: artist.uri,
//             };
//           })
//         );
//       },
//       (err) => {
//         return null;
//       }
//     );
//   }, [accessToken]);

//   return (
// <Container className="profile-container">
//   <div className="user-info-container">
//     <UserInfo
//       userURL={userSpotifyURL}
//       username={username}
//       userImage={userImage}
//     />
//   </div>

//   <div className="favorites-container">
//     <div className="my-top-text">My top tracks:</div>
//     <div className="top-tracks-container">
//       {userTopTracks.map((track) => (
//         <TopTracks track={track} key={track.uri} />
//       ))}
//     </div>

//     <div className="my-top-text">My top artists:</div>
//     <div className="top-artists-container">
//       {userTopArtists.map((artist) => (
//         <TopArtists artist={artist} key={artist.uri} />
//       ))}
//     </div>
//     <div className="my-top-text">My top genres:</div>
//     <div className="top-genres-container">
//       {userArtistData.map((artist) => (
//         <div className="genre">{artist.genres[0]}</div>
//       ))}
//     </div>
//   </div>
// </Container>
//   );
// };

// export default Dashboard;
