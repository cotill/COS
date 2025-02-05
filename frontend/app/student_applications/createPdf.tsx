"use client";

import React, { useState } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image, Svg } from "@react-pdf/renderer";
import { Project } from "@/utils/types";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 50,   
    paddingRight: 50,  
  },
  section: {
    marginBottom: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    marginBottom: 4,
  },
  image: {
    width: 100, 
    height: 40, 
  },
  header: {
    flexDirection: "row",  // Arrange items in a row
    justifyContent: "space-between",  // Push items to the sides
    alignItems: "center",  // Align vertically in the center
    marginBottom: 10,
  },

});

const MyDocument = ({ project }: { project: Project }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Project Details</Text>
        <Image style={styles.image} src="/ttg-pdf.png" />
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>Project ID: {project.project_id}</Text>
        <Text style={styles.text}>Sponsor: {project.sponsor_email}</Text>
        <Text style={styles.text}>{project.description}</Text>
      </View>
    </Page>
  </Document>
);

function CreatePdf({ project }: { project: Project }) {
  const [loading, setLoading] = useState(true);
  if (!project) {
    return <p>Failed to load project.</p>;
  }
  
  return (
    <div className="App">
      <PDFDownloadLink document={<MyDocument project={project} />} fileName={`Capstone-${project.title}.pdf`}>
        {({ blob, url, loading, error }) => (loading ? "Loading document..." : "Download now!")}
      </PDFDownloadLink>
    </div>
  );
}
export default CreatePdf;


