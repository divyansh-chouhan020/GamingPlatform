import Head from "next/head";
import { useState, useEffect } from "react";
import { useDispatch} from "react-redux";
import { Box, Typography, Grid } from "@mui/material";
import { setTheme } from "@/redux/slices/themeSlice";
import Cookies from "js-cookie";
import { gameAPI } from "@/services/api";
import { GameCard } from "@/components/common/gameComponents";
import { Loader, Toast, Button } from "@/components/common/uiComponents";
import Layout from "@/components/common/layoutComponent";
import { Hero, GameCategory, PlatformFeatures } from "@/components/common/homeComponents";
//import { GENRES } from "@/constants/genres";

// Static game data for featured sections
const featuredGames = [
  { name: "Stellar Blade", developer: "dev_stellar", image: "/featuredGames/stellarBlade.webp" },
  { name: "Need For Speed", developer: "dev_nfs", image: "/featuredGames/needForSpeed.jpg" },
  { name: "Fortnite", developer: "dev_fortnite", image: "https://tse4.mm.bing.net/th/id/OIP.C5A17VtI1jviPImGPZqAXgHaEK?pid=ImgDet&w=178&h=99&c=7&dpr=1.5&o=7&rm=3" },
  { name: "WWE 2K24", developer: "dev_nba", image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/59f0f0b7-ac9c-4bb3-947e-bc0e3be8398a/dgetpv5-ff390344-50bb-4caa-a04c-fff4e117d91c.jpg/v1/fill/w_1024,h_1290,q_75,strp/wwe_2k24_cover_design_11___roman_reigns_by_cngjl1986_dgetpv5-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI5MCIsInBhdGgiOiJcL2ZcLzU5ZjBmMGI3LWFjOWMtNGJiMy05NDdlLWJjMGUzYmU4Mzk4YVwvZGdldHB2NS1mZjM5MDM0NC01MGJiLTRjYWEtYTA0Yy1mZmY0ZTExN2Q5MWMuanBnIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.zPFxpdWIWNUdVf9o43-4ZX3Ms7dtsCfVLVU7I3WnZgg" },
  { name: "Fable Legends", developer: "dev_fable", image: "https://images.alphacoders.com/655/655398.jpg" },
  { name: "Mortal Kombat 1", developer: "dev_mk", image: "https://cdn1.epicgames.com/offer/fda0f2b4047f46ffb4e94d5595c1468e/EGS_MortalKombat1PremiumEdition_NetherRealmStudios_Editions_S1_2560x1440-43d47cfc125118b13b26cea9c80ae15c" },
  { name: "The Witcher 3", developer: "dev_witcher", image: "https://cdn.mos.cms.futurecdn.net/rjhoJx3c4TR8H5kXjYpUKm.jpg" },
  { name: "Cyberpunk 2077", developer: "dev_cyberpunk", image: "https://cdn1.epicgames.com/offer/carousel/cyberpunk-2077_1200x1600-1200x1600-405c9c60e3c1c100d8e0baa36f60b955" },
  { name: "Red Dead Redemption 2", developer: "dev_rdr2", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg" },
  { name: "Horizon Zero Dawn", developer: "dev_horizon", image: "https://cdn1.epicgames.com/offer/carousel/HZD_1200x1600_1200x1600-4c0b5c5e0b3e5c0b5c5e0b3e5c0b5c5e" }
];

const popularGames = [
  { name: "GTA V", developer: "dev_gta", image: "https://tse2.mm.bing.net/th/id/OIP.CjjkN8QUmOp0whkyl-7g5AHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "Call of Duty", developer: "dev_cod", image: "https://tse3.mm.bing.net/th/id/OIP.HCb9qcYZmDUtf_FFHTdWSwHaFP?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "Valorant", developer: "dev_valorant", image: "https://editors.dexerto.com/wp-content/uploads/2020/12/breach-and-sage-2.jpg" },
  { name: "Hollow Knight", developer: "dev_hollow", image: "https://th.bing.com/th/id/OIP.QHEXc9DyAPMC-00O2gRjrAHaEu?w=281&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3" },
  { name: "Undertale", developer: "dev_undertale", image: "https://www.kolpaper.com/wp-content/uploads/2020/05/Undertale-Wallpaper.jpg" },
  { name: "Hades", developer: "dev_hades", image: "https://store-images.s-microsoft.com/image/apps.48496.14093828725404571.e8c4fd85-da7e-4c33-9a85-c97c9f3eeb38.fde6f3ed-4a08-4bb8-8240-9cd19e049803" },
  { name: "Among Us", developer: "dev_amongus", image: "https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg" },
  { name: "Fall Guys", developer: "dev_fallguys", image: "https://cdn2.unrealengine.com/egs-fallguys-mediatonic-g1a-00-1920x1080-1920x1080-1920x1080-1920x1080-1920x1080-1920x1080-1920x1080-1920x1080.jpg" },
  { name: "Apex Legends", developer: "dev_apex", image: "https://cdn1.epicgames.com/offer/carousel/apex-legends_1200x1600_1200x1600-1200x1600-1200x1600-1200x1600" },
  { name: "Rocket League", developer: "dev_rocket", image: "https://cdn1.epicgames.com/offer/carousel/rocket-league_1200x1600_1200x1600-1200x1600-1200x1600-1200x1600" }
];

const racingGames = [
  { name: "F1 23", developer: "dev_f1", image: "https://tse2.mm.bing.net/th/id/OIP.l_Tv70M8jw5Eg8Rge8WxMwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "Need For Speed", developer: "dev_nfs", image: "https://th.bing.com/th/id/OIP.9ZRHAfPDQ1I2n0CrIqRvSgHaEK?w=280&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3" },
  { name: "Asphalt 9", developer: "dev_asphalt", image: "https://vignette.wikia.nocookie.net/asphalt/images/2/22/A9_1.0_icon.png/revision/latest?cb=20180420125431" },
  { name: "Dirt 5", developer: "dev_dirt", image: "https://th.bing.com/th/id/OIP.nWQffnCMYtWLHGcfFsvN6gHaEK?w=281&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3" },
  { name: "Hot Wheels Unleashed", developer: "dev_hotwheels", image: "https://tse1.mm.bing.net/th/id/OIP.Or1YxLr7MlYb7-n3TfZSCwHaEd?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "Mario Kart", developer: "dev_mario", image: "https://tse1.mm.bing.net/th/id/OIP.V8_waXQCHG7uy6g5fpGSngHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "Forza Horizon 5", developer: "dev_forza", image: "https://cdn1.epicgames.com/offer/carousel/forza-horizon-5_1200x1600_1200x1600-1200x1600-1200x1600-1200x1600" },
  { name: "Gran Turismo 7", developer: "dev_gt7", image: "https://cdn.mos.cms.futurecdn.net/8qJqJqJqJqJqJqJqJqJqJq.jpg" },
  { name: "Trackmania", developer: "dev_trackmania", image: "https://cdn1.epicgames.com/offer/carousel/trackmania_1200x1600_1200x1600-1200x1600-1200x1600-1200x1600" },
  { name: "WRC 10", developer: "dev_wrc", image: "https://cdn1.epicgames.com/offer/carousel/wrc-10_1200x1600_1200x1600-1200x1600-1200x1600-1200x1600" }
];

const actionGames = [
  { name: "NBA 2K24", developer: "dev_nba", image: "https://th.bing.com/th/id/OIP.Ofg-uFWstIeAqXH9GEqC4QHaI5?w=149&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3" },
  { name: "Tekken 8", developer: "dev_tekken", image: "https://assets-prd.ignimgs.com/2022/09/15/tekken8-1663261659390.jpg" },
  { name: "Assassin's Creed", developer: "dev_ac", image: "https://tse3.mm.bing.net/th/id/OIP.MWv957MVXpqNhT3ayDZzNgHaKc?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "Elden Ring", developer: "dev_elden", image: "https://static.bandainamcoent.eu/high/elden-ring/elden-ring/00-page-setup/elden-ring-new-header-mobile.jpg" },
  { name: "Spider-Man", developer: "dev_spiderman", image: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2023/12/spider-man.jpeg" },
  { name: "God of War", developer: "dev_gow", image: "https://image.api.playstation.com/vulcan/img/rnd/202010/2217/ax0V5TYMax06mLzmkWeQMiwH.jpg" },
  { name: "Devil May Cry 5", developer: "dev_dmc5", image: "https://cdn1.epicgames.com/offer/carousel/devil-may-cry-5_1200x1600_1200x1600-1200x1600-1200x1600-1200x1600" },
  { name: "Doom Eternal", developer: "dev_doom", image: "https://cdn1.epicgames.com/offer/carousel/doom-eternal_1200x1600_1200x1600-1200x1600-1200x1600-1200x1600" },
  { name: "Sekiro", developer: "dev_sekiro", image: "https://cdn1.epicgames.com/offer/carousel/sekiro_1200x1600_1200x1600-1200x1600-1200x1600-1200x1600" },
  { name: "Dark Souls 3", developer: "dev_darksouls", image: "https://cdn1.epicgames.com/offer/carousel/dark-souls-3_1200x1600_1200x1600-1200x1600-1200x1600-1200x1600" }
];

export default function Home() {
  const dispatch = useDispatch();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    genre: "",
    keyword: "",
  });

  useEffect(() => {
    const savedTheme = Cookies.get("theme");
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchGames();
  }, [page, filters]);

  const fetchGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 12,
      };
      
      if (filters.genre) {
        params.genre = filters.genre;
      }
      
      if (filters.keyword) {
        params.keyword = filters.keyword;
      }

      const response = await gameAPI.listAllGames(params);
      setGames(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to fetch games");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  };

  if (loading && games.length === 0) {
    return <Loader fullscreen />;
  }

  return (
    <>
      <Head>
        <title>CyberArena - Discover & Play Indie Games Instantly</title>
        <meta name="description" content="Join a growing community and explore something unique" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout filters={filters} onFilterChange={handleFilterChange}>
        <Box sx={{ width: "100%", minHeight: "100vh" }}>
          {/* Hero Section */}
          <Hero />

          {/* Featured Games Section */}
          <Box id="featured-games">
            <GameCategory
              title="FEATURED GAMES"
              description="Handpicked featured games found by the community"
              category="featured"
              games={featuredGames}
            />
          </Box>

          {/* Popular Games Section */}
          <GameCategory
            title="POPULAR GAMES"
            description="Trending games loved by the community"
            category="popular"
            games={popularGames}
          />

          {/* Racing Games Section */}
          <GameCategory
            title="RACING GAMES"
            description="Fast-paced racing action"
            category="racing"
            games={racingGames}
          />

          {/* Action Games Section */}
          <GameCategory
            title="ACTION GAMES"
            description="Thrilling action-packed adventures"
            category="action"
            games={actionGames}
          />

          {/* Platform Features Section */}
          <PlatformFeatures />

          {/* All Games Section */}
          {games.length > 0 && (
            <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: { xs: "24px", md: "48px" } }}>
              {loading ? (
                <Box sx={{ textAlign: "center", padding: "48px" }}>
                  <Loader />
                </Box>
              ) : (
                <>
                  <Grid container spacing={3}>
                    {games.map((game) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={game._id}>
                        <GameCard
                          title={game.title}
                          genre={game.genre}
                          thumbnail={game.avatar?.url || "/placeholder-game.png"}
                          averageRating={game.averageRating || 0}
                          totalReviews={game.totalReviews || 0}
                          onPlay={() => {
                            window.location.href = `/game/${game._id}`;
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  {totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
                      <Button
                        label="Previous"
                        variant="secondary"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      />
                      <Typography sx={{ alignSelf: "center", padding: "0 16px" }}>
                        Page {page} of {totalPages}
                      </Typography>
                      <Button
                        label="Next"
                        variant="secondary"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      />
                    </Box>
                  )}
                </>
              )}

              {showToast && error && (
                <Toast
                  message={error}
                  type="error"
                  onClose={() => setShowToast(false)}
                />
              )}
            </Box>
          )}
        </Box>
      </Layout>
    </>
  );
}
