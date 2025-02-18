import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {addMovie} from '../redux/shortlistedMovies';
import {fetchMovies} from '../api/moviesApi';
import Modal from 'react-native-modal';

const MovieList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchQuery);
      setPage(1);
      setMovies([]);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const {data, isFetching} = useQuery(
    ['movies', debouncedTerm, page],
    () => fetchMovies(debouncedTerm, page),
    {
      enabled: !!debouncedTerm,
      keepPreviousData: true,
      onSuccess: newData => {
        if (page === 1) {
          setMovies(newData?.Search || []);
        } else {
          setMovies(prevMovies => [...prevMovies, ...(newData?.Search || [])]);
        }
        setIsFetchingMore(false);
      },
    },
  );

  const shortlistedMovies = useSelector(
    state => state.shortlistedMovies.movies,
  );

  const handleAddToShortlist = movie => {
    const isAlreadyAdded = shortlistedMovies.some(
      shortlistedMovie => shortlistedMovie.imdbID === movie.imdbID,
    );

    if (!isAlreadyAdded) {
      dispatch(addMovie(movie));
    } else {
      setIsModalVisible(true);
    }
  };

  const handleLoadMore = () => {
    if (!isFetchingMore && !isFetching && data?.Search?.length >= 10) {
      setIsFetchingMore(true);
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.subText}>Hey, Buddy</Text>
          <Text style={styles.greetingText}>Let's Search a movie</Text>
        </View>
        <Image
          source={require('../assets/Homescreen_Banner.png')}
          style={styles.bannerImage}
        />
      </View>
      {/* Search container */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Movies..."
          placeholderTextColor={'#ccc'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Image
            source={require('../assets/Search_Icon.png')}
            style={styles.iconImage}
          />
        </TouchableOpacity>
      </View>
      {/* Modal container */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Movie already shortlisted!</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setIsModalVisible(false)}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Flatlist container */}
      <FlatList
        data={movies}
        keyExtractor={item => item.imdbID}
        renderItem={({item}) => (
          <View style={styles.listContainer}>
            <Image source={{uri: item.Poster}} style={styles.image} />
            <View style={styles.detailsContainer}>
              <Text style={styles.title}>{item.Title}</Text>
              <TouchableOpacity
                style={styles.shortlistButton}
                onPress={() => handleAddToShortlist(item)}
                activeOpacity={0.7}>
                <Text style={styles.buttonText}>Shortlist</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore || isFetching ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 10,
  },
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  textContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 25,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subText: {
    fontSize: 18,
    color: '#555',
  },
  bannerImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  searchIcon: {
    padding: 8,
  },
  iconImage: {
    width: 20,
    height: 20,
    tintColor: '#888',
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  shortlistButton: {
    backgroundColor: '#ff6b81',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#ff6b81',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MovieList;
