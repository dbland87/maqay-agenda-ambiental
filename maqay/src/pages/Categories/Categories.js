import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Categories.css";
import descriptionCategory from "../../utils/descriptionCategory";
import Card from "./Card/Card";
import Footer from "../commons/Footer/Footer";
import ButtonFilterNav from "./ButtonFilterNav/ButtonFilterNav.jsx";
import {
  getAllPosts,
  getTagsByGroupName,
  getAllTagsNameAndNumber,
} from "../../controller/postController";
import MetaDecorator from "./MetaDecorator/MetaDecorator";
import allPosts from "../../utils/data/allPosts.js";
import allTagsNameAndNumber from "../../utils/data/allTagsNameAndNumber.js";
import tagsByGroupName from "../../utils/data/tagsByGroupName.js";

const Categories = () => {
  /* posts to render */
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [politicalPartiesTags, setPoliticalPartiesTags] = useState([]);
  const [navBarTags, setNavBarTags] = useState([]);
  /* set category debe ir dentro de la fx que saca las cosas del windowlocation */
  const [mainCategory, setMainCategory] = useState([]);
  const [categorySelected, setCategorySelected] = useState([]);
  const [categorySelectedTags, setCategorySelectedTags] = useState([]);

  /* All posts from Wordpress within category Environmental, with a number set by WP */
  /*   useEffect(() => {
    const categoryAmbiental = 23;
    getAllPosts()
      .then((res) =>
        res.filter((posts) => posts.categories[0] === categoryAmbiental)
      )
      .then((res) => {
        return setFilteredPosts(res);
      });
  }, []); */

  /* Political Parties Tags */
  useEffect(() => {
    getTagsByGroupName(tagsByGroupName, "Partidos políticos").map((tags) => {
      return setPoliticalPartiesTags((prevState) => [...prevState, tags]);
    });
  }, []);

  const { category, subcategory } = useParams();
  useEffect(() => {
    setCategorySelected(subcategory);
    setMainCategory(category);
  }, [category, subcategory]);

  useEffect(() => {
    if (mainCategory.length > 0) {
      getTagsByGroupName(tagsByGroupName, mainCategory).map((tags) => {
        return setCategorySelectedTags((prevState) => [...prevState, tags]);
      });
    }
  }, [mainCategory]);

  /* NAVIGATION BAR Functions 
  DEBE CONVERTIRSE FX PURA CON ARGUMENTO ENVIRONMENTAL O POLITICAL Y VARIAR SEGUN CATEGORY SELECTED*/
  useEffect(() => {
    if (categorySelectedTags) {
      const newArray = allTagsNameAndNumber.filter((tag) => {
        return categorySelectedTags.includes(tag.id);
      });
      setNavBarTags(newArray);
    }
  }, [categorySelectedTags]);

  /* Create property "politicalParties" with only tag number of politicalparties from every post*/

  const tagName = () => {
    // post.tags es el array de tags de cada post
    return allPosts.map((post) => {
      const tags = post.tags;
      const array = politicalPartiesTags.filter((politicalTagNumber) => {
        return tags.includes(politicalTagNumber);
      });
      return (post.politicalParties = array);
    });
  };
  console.log("tagName: ", tagName());

  /* filtered posts */
  useEffect(() => {
    const newArray = allTagsNameAndNumber.find((tag) => {
      return categorySelected.includes(tag.name);
    });

    if (newArray) {
      const array = allPosts.filter((post) => {
        const tags = post.tags;
        return tags.includes(newArray.id);
      });
      return setFilteredPosts(array);
    }
  }, [categorySelected]);

  const location = useLocation();
  const currentUrl =
    "https://maqay.netlify.app" + location.pathname.replace(/ /g, "-");

  return (
    <div>
      {categorySelected.length > 0 && (
        <MetaDecorator
          title={`Agenda Ambiental - ${categorySelected}`}
          description={currentUrl}
          imgURL={`/img/${categorySelected.replace(/<\/?p[^>]*>/g, "")}.png`}
        />
      )}
      <header>
        <span>{categorySelected}</span>
      </header>
      <main>
        <section className='view-categories'>
          <span className='text-bold'>
            HEMOS IDENTIFICADO{" "}
            <span className='highlighted'>{filteredPosts.length}</span>{" "}
            PROPUESTAS
          </span>
          <p className='main-text'>
            {categorySelected.length > 0 &&
              descriptionCategory[categorySelected.replace(/ /g, "")]}
          </p>
          <p className='leyenda'>
            Para facilitar el análisis de las propuestas hemos identificado 8
            temas ambientales que son prioritarios para el país, las propuestas
            de color VERDE, son aquellas que corresponden a estos temas. Las
            propuestas color ÁMBAR, son aquellas que no abordan los temas
            priorizados. En el caso del color ROJO, son aquellas en las que se
            proponen disminuir estándares o permisos ambientales, cambios
            institucionales como la absorción o eliminación de instituciones
            ambientales.
          </p>
          <div className='alerts-guide'> </div>
          <div className='categories-cards-container'>
            {/* Recibe los posts filtrados según el tema seleccionado */}
            {filteredPosts.map((post) => {
              return <Card key={post.id} post={post} />;
            })}
          </div>
        </section>

        <nav>
          <button
            className='btn-back'
            onClick={() => {
              window.location = "/";
            }}
          >
            <i className='fas fa-chevron-left'></i>REGRESAR
          </button>
          <span>Cambiar de tema ambiental</span>
          {navBarTags.map((tag) => {
            return (
              <ButtonFilterNav
                key={tag.id}
                tagByTopic={tag}
                path={`/propuestas/${mainCategory}/${tag.name}`}
              />
            );
          })}
        </nav>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default Categories;

/*  useEffect(() => {
    const newArray = allTagsNameAndNumber.filter((tag) => {
      return politicalPartiesTags.includes(tag.number);
    });
    setNavBarTags(newArray);
  }, []); */
