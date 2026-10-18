package com.dbit.eventsystem.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummaryDTO {
    private long totalEvents;
    private long upcomingEvents;
    private long totalRegistrations;
    private long totalVenues;
    private long totalOrganizers;
    private Map<String, Long> categoryCounts;
    private List<EventResponseDTO> recentUpcomingEvents;

    public DashboardSummaryDTO() {
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getUpcomingEvents() {
        return upcomingEvents;
    }

    public void setUpcomingEvents(long upcomingEvents) {
        this.upcomingEvents = upcomingEvents;
    }

    public long getTotalRegistrations() {
        return totalRegistrations;
    }

    public void setTotalRegistrations(long totalRegistrations) {
        this.totalRegistrations = totalRegistrations;
    }

    public long getTotalVenues() {
        return totalVenues;
    }

    public void setTotalVenues(long totalVenues) {
        this.totalVenues = totalVenues;
    }

    public long getTotalOrganizers() {
        return totalOrganizers;
    }

    public void setTotalOrganizers(long totalOrganizers) {
        this.totalOrganizers = totalOrganizers;
    }

    public Map<String, Long> getCategoryCounts() {
        return categoryCounts;
    }

    public void setCategoryCounts(Map<String, Long> categoryCounts) {
        this.categoryCounts = categoryCounts;
    }

    public List<EventResponseDTO> getRecentUpcomingEvents() {
        return recentUpcomingEvents;
    }

    public void setRecentUpcomingEvents(List<EventResponseDTO> recentUpcomingEvents) {
        this.recentUpcomingEvents = recentUpcomingEvents;
    }
}
