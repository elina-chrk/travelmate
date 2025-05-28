import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Layout from "../components/Layout";
import TripCard from "../components/TripCard";
import PageHeader from "../components/ui/PageHeader";
import PrimaryButton from "../components/ui/PrimaryButton";
import EmptyState from "../components/ui/EmptyState";
import './HomePage.css';

function HomePage() {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/travel-groups")
      .then((res) => setTrips(res.data || []))
      .catch((err) => console.error("Не вдалося отримати список подорожей", err));
  }, []);

  return (
    <Layout>
        <div className="container">
          <PageHeader
          title="Подорожі"
          subtitle="Ознайомся з доступними подорожами або створи власну"
          action={
            <PrimaryButton onClick={() => navigate("/create-trip")}>
              ➕ Створити подорож
            </PrimaryButton>
          }
        />
        {trips.length === 0 ? (
          <EmptyState
            title="Наразі немає доступних подорожей"
            message="Будь першим, хто створить нову пригоду!"
          />
        ) : (
          <ul className="trip-list">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

export default HomePage;
