"use client";

import React, { useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
  Svg,
} from "@react-pdf/renderer";
import { Project } from "@/utils/types";
import { Button } from "@/components/ui/button";

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
    fontFamily: 'Helvetica-Bold',
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
    flexDirection: "row", // Arrange items in a row
    justifyContent: "space-between", // Push items to the sides
    alignItems: "center", // Align vertically in the center
    marginBottom: 10,
  },
});

const convertMDtoPlain = (markdown) => {
  const parts = markdown.split(/\*\*(.*?)\*\*/g);
  
  return (
    <Text style={{ fontSize: 12 }}>
      {parts.map((part, index) => {
        // If the index is odd, it's a bolded part
        if (index % 2 === 1) {
          return (
            <Text key={index} style={{ fontFamily: 'Helvetica-Bold' }}>
              {part}
            </Text>
          );
        }
        // Otherwise, it's regular text
        return part;
      })}
    </Text>
  );
};
const MyDocument = ({ project }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Project Details</Text>
        <Image style={styles.image} src="/ttg-pdf.png" />
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>Project ID: {project.project_id}</Text>
        <Text style={styles.text}>Sponsor: {project.sponsor_email}</Text>
        <View style={styles.section}>{convertMDtoPlain(project.description)}</View>
      </View>
    </Page>
  </Document>
);

function CreatePdf({ project }) {
  const [loading, setLoading] = useState(true);
  if (!project) {
    return <p>Failed to load project.</p>;
  }

  return (
    <div className="App">
      <PDFDownloadLink
        document={<MyDocument project={project} />}
        fileName={`Capstone-${project.title}.pdf`}
      >
        {/* {({ blob, url, loading, error }) => (loading ? "Loading document..." : "Download now!")} */}
        {({ blob, url, loading, error }) => (
          <Button variant='outline'>
            {loading ? "Loading document..." : "Download now!"}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
}
export default CreatePdf;
