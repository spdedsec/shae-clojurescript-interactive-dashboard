(ns shae.dashboard
  (:require [reagent.core :as reagent]
            [reagent.dom :as rdom]))

(defonce app-state (reagent/atom {:metrics {}
                                  :charts {}
                                  :logs []}))

(defn metric-card [label value]
  [:div.card
   [:h3.label label]
   [:p.value value]])

(defn dashboard []
  [:div.dashboard
   [:h1.title "SHAE Dashboard"]
   [:div.metrics
    (metric-card "CPU" "12%")
    (metric-card "Memory" "4.2 GB")
    (metric-card "Disk" "68%")]
   [:div.charts
    [:h2 "Charts"]
    [:div.chart-placeholder "Chart area"]]
   [:div.logs
    [:h2 "Live Logs"]
    [:ul.log-list
     (for [log @(:logs @app-state)]
       [:li.log-entry log])]])

(defn ^:export init []
  (rdom/root [dashboard]
             (.getElementById js/document "app")))
