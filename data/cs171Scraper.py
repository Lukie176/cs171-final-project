import sys
import requests
import csv
from bs4 import BeautifulSoup

# Global Parameters
WEEK = int(sys.argv[1])
website1Flag = int(sys.argv[2])

# Define parameters for BeautifulSoup
url0 = "https://www.footballdb.com/transactions/injuries.html"
url1 = "https://www.vegasinsider.com/nfl/injuries/"
csv0 = "dataset0.csv"
csv1 = "dataset1.csv"
headers = {'User-Agent': 'Mozilla/5.0'}

# Convert from naviableString to string
def stringify (s) -> str:
  return (str(s.contents[0]))

# Remove all occurances in s of substrings in lst
def replacer (s: str, lst: list) -> str:
  for char in lst:
    s = s.replace(char, '')
  return (s)

# Categories
categories = ["Abdomen", "Achilles", "Ankle", "Back", "Biceps", "Calf", "Chest", "Concussion", 
              "Elbow", "Fibula", "Finger", "Foot", "Forearm", "Groin", "Hamstring", "Hand", "Heel", "Hip", "Illness", 
              "Knee", "Neck", "Oblique", "Pectoral", "Quadricep", "Rib", "Shin", "Shoulder", "Thigh", "Thumb", "Toe", 
              "Tricep", "Wrist"]

# Scrape Website 1 if website1Flag is True
# Years 2016-2020, Weeks 1-WEEK, Regular Season
# Open csv file, clear file, and write to it
if website1Flag:
  with open(csv0, 'w+', newline='') as csvfile:
    # Write csv column headers
    csvWriter = csv.writer(csvfile)
    csvWriter.writerow(["year","week","team","player","position", "injury"])
    for year in range(2016, 2021):
      for week in range(1, WEEK + 1):
        # Define request URL
        newUrl0 = url0 + "?yr=" + str(year) + "&wk=" + str(week) + "&type=reg"
        req = requests.get(newUrl0, headers=headers)
        soup = BeautifulSoup(req.content, 'html.parser')

        # Find all relevant elements for players
        data = soup.select(".td.w20:nth-of-type(odd)")
        for item in data:
          # Initialize row with year, week; Find and add other entries
          row = [str(year), str(week)]
          row.append(stringify(item.parent.parent.previous_sibling.previous_sibling.b))
          row.append(item.contents[0].string)
          row.append(replacer(item.contents[1], [',',' ']))
          if "Not Injury Related" in item.contents[2].contents[0]:
            continue
          elif "," in item.contents[2].contents[0]:
            row.append("Multiple Injuries")
          else:
            for injury in categories:
              if injury in item.contents[2].contents[0]:
                row.append(injury)
                break
          if len(row) != 6:
            row.append("Other")

          # Write row to csv file
          csvWriter.writerow(row)
  print("Dataset 1 Complete!")

# Scrape Website 2
# Open csv file, clear file, and write to it
with open(csv1, 'w+', newline='') as csvfile:
  # Parse HTML using BeautifulSoup
  req = requests.get(url1, headers=headers)
  soup = BeautifulSoup(req.content, 'html.parser')

  # Find all relevant table cells
  data = soup.select(".viCellBg1, .viCellBg2")
  csvWriter = csv.writer(csvfile)

  # Write csv column headers
  csvWriter.writerow(["team","player","position","date","injury","status","expected_return"])
  
  # For each item, insert into row array and write when full
  row = []
  for i, item in enumerate(data):
    toInsert = stringify(item)

    # Discard all comments
    if "Comments" in toInsert: continue

    # Add team if new row
    if not row:
      row.append(stringify(item.parent.parent.parent.parent.parent.td))

    # If date is found on new row, data must apply to previous player
    if toInsert and "2020" in toInsert and len(row) == 1:
      row.append(stringify(data[i - 6]))
      row.append(stringify(data[i - 5]))
    
    # Insert data into row
    row.append(toInsert)

    # Write to csv file when row is full, reset row
    if len(row) == 7:
      csvWriter.writerow(row)
      row = []
print("Dataset 2 Complete!")
