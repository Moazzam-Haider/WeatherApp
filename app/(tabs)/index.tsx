import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, ActivityIndicator, ImageBackground, Image } from 'react-native';
import axios, { AxiosError } from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; // Example: using FontAwesome icons

type WeatherData = {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
};

const API_KEY = '20c4bd51cf84f12ebda1a2d7f69862bc'; // Replace with your OpenWeatherMap API key
const BACKGROUND_IMAGE_URL = 'https://example.com/background.jpg'; // Replace with your background image URL

const App = () => {
  const [cityName, setCityName] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async () => {
    if (!cityName) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        cityName
      )}&units=metric&appid=${API_KEY}`;
      const response = await axios.get<WeatherData>(url);

      if (response.status === 200) {
        setWeatherData(response.data);
      } else {
        setError(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleAxiosError(error);
      } else {
        setError('Failed to fetch weather data');
        console.error('Unknown error fetching weather data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAxiosError = (error: AxiosError) => {
    if (error.response) {
      setError(`Request failed with status ${error.response.status}`);
      console.error('Error response from server:', error.response.data);
    } else if (error.request) {
      setError('Request made but no response received');
      console.error('No response received:', error.request);
    } else {
      setError('Error setting up the request');
      console.error('Error setting up the request:', error.message);
    }
  };

  const renderWeatherIcon = (iconName: string) => {
    // Example: Mapping weather conditions to FontAwesome icons
    switch (iconName) {
      case 'Clear':
        return <Icon name="sun-o" size={50} color="#FFD700" />;
      case 'Clouds':
        return <Icon name="cloud" size={50} color="#708090" />;
      case 'Rain':
        return <Icon name="umbrella" size={50} color="#4682B4" />;
      default:
        return <Icon name="question-circle" size={50} color="#A9A9A9" />;
    }
  };

  return (
    <ImageBackground source={{ uri: BACKGROUND_IMAGE_URL }} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Weather App Internship Task</Text>
        </View>

        <Text style={styles.label}>City Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          value={cityName}
          onChangeText={setCityName}
        />
        <Button title="Get Weather Data" onPress={fetchWeatherData} />

        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        {error && <Text style={styles.error}>{error}</Text>}

        {weatherData && (
          <View style={styles.weatherContainer}>
            <Text style={styles.weatherHeader}>Weather in {cityName}:</Text>
            <View style={styles.weatherIcon}>{renderWeatherIcon(weatherData.weather[0].main)}</View>
            <Text>Main: {weatherData.weather[0].main}</Text>
            <Text>Description: {weatherData.weather[0].description}</Text>
            <Text>Temperature: {weatherData.main.temp} °C</Text>
            <Text>Feels Like: {weatherData.main.feels_like} °C</Text>
            <Text>Humidity: {weatherData.main.humidity}%</Text>
            <Text>Wind Speed: {weatherData.wind.speed} m/s</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Developed by Moazzam Haider</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Transparent background to let the image show through
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  weatherIcon: {
    marginBottom: 10,
  },
  weatherHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
  },
  footerText: {
    fontSize: 12,
    color: 'gray',
  },
});

export default App;
